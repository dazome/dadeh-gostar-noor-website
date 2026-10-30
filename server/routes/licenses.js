
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const { sql, poolPromise } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const validateUploadedFile = require("../middleware/validateUploadedFile");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads/licenses");

fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"]
};

const validateLicenseFile = validateUploadedFile(allowedTypes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = allowedTypes[file.mimetype];

    if (
      allowedExtensions &&
      allowedExtensions.includes(extension)
    ) {
      return cb(null, true);
    }

    cb(new Error("فرمت فایل باید JPG، PNG، WebP، GIF یا PDF باشد."));
  }
});

function removeFile(filePath) {
  if (
    typeof filePath !== "string" ||
    !filePath.startsWith("/uploads/licenses/")
  ) {
    return;
  }

  const filename = path.basename(filePath);
  const fullPath = path.join(uploadDir, filename);

  fs.promises.unlink(fullPath).catch((error) => {
    if (error.code !== "ENOENT") {
      console.error("Remove license file error:", error);
    }
  });
}

function cleanupUploadedFile(req) {
  if (req.file) {
    fs.promises.unlink(req.file.path).catch(() => {});
  }
}

function handleUpload(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const message =
          error.code === "LIMIT_FILE_SIZE"
            ? "حجم فایل نباید بیشتر از ۵ مگابایت باشد."
            : "آپلود فایل با خطا مواجه شد.";

        return res.status(400).json({ message });
      }

      return res.status(400).json({
        message: error.message || "آپلود فایل ناموفق بود."
      });
    }

    next();
  });
}


router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT id, title, description, filePath
      FROM Licenses
      ORDER BY id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Get licenses error:", error);
    res.status(500).json({
      message: "دریافت فهرست مجوزها ناموفق بود."
    });
  }
});


router.post(
  "/",
  authMiddleware,
  handleUpload,
  validateLicenseFile,
  async (req, res) => {
    try {
      const title = req.body.title;
      const description = req.body.description ?? "";

      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 255
      ) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "عنوان مجوز الزامی است و باید حداکثر ۲۵۵ کاراکتر باشد."
        });
      }

      if (
        typeof description !== "string" ||
        description.length > 1000
      ) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد."
        });
      }

      const filePath = req.file
        ? `/uploads/licenses/${req.file.filename}`
        : null;

      const pool = await poolPromise;

      const result = await pool.request()
        .input("title", sql.NVarChar(255), title.trim())
        .input(
          "description",
          sql.NVarChar(1000),
          description.trim() || null
        )
        .input("filePath", sql.NVarChar(500), filePath)
        .query(`
          INSERT INTO Licenses (title, description, filePath)
          OUTPUT
            INSERTED.id,
            INSERTED.title,
            INSERTED.description,
            INSERTED.filePath
          VALUES (@title, @description, @filePath)
        `);

      res.status(201).json({
        message: "مجوز با موفقیت اضافه شد.",
        license: result.recordset[0]
      });
    } catch (error) {
      cleanupUploadedFile(req);
      console.error("Create license error:", error);
      res.status(500).json({
        message: "افزودن مجوز ناموفق بود."
      });
    }
  }
);


router.put(
  "/:id",
  authMiddleware,
  handleUpload,
  validateLicenseFile,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const title = req.body.title;
      const description = req.body.description ?? "";

      if (!Number.isInteger(id) || id < 1) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "شناسه مجوز معتبر نیست."
        });
      }

      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 255
      ) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "عنوان مجوز الزامی است و باید حداکثر ۲۵۵ کاراکتر باشد."
        });
      }

      if (
        typeof description !== "string" ||
        description.length > 1000
      ) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد."
        });
      }

      const pool = await poolPromise;

      const existing = await pool.request()
        .input("id", sql.Int, id)
        .query(`
          SELECT id, filePath
          FROM Licenses
          WHERE id = @id
        `);

      if (existing.recordset.length === 0) {
        cleanupUploadedFile(req);
        return res.status(404).json({
          message: "مجوز موردنظر پیدا نشد."
        });
      }

      const oldFilePath = existing.recordset[0].filePath;
      const newFilePath = req.file
        ? `/uploads/licenses/${req.file.filename}`
        : oldFilePath;

      const result = await pool.request()
        .input("id", sql.Int, id)
        .input("title", sql.NVarChar(255), title.trim())
        .input(
          "description",
          sql.NVarChar(1000),
          description.trim() || null
        )
        .input("filePath", sql.NVarChar(500), newFilePath)
        .query(`
          UPDATE Licenses
          SET
            title = @title,
            description = @description,
            filePath = @filePath
          OUTPUT
            INSERTED.id,
            INSERTED.title,
            INSERTED.description,
            INSERTED.filePath
          WHERE id = @id
        `);

      if (req.file && oldFilePath !== newFilePath) {
        removeFile(oldFilePath);
      }

      res.json({
        message: "اطلاعات مجوز به‌روزرسانی شد.",
        license: result.recordset[0]
      });
    } catch (error) {
      cleanupUploadedFile(req);
      console.error("Update license error:", error);
      res.status(500).json({
        message: "ویرایش مجوز ناموفق بود."
      });
    }
  }
);


router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "شناسه مجوز معتبر نیست."
    });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM Licenses
        OUTPUT DELETED.filePath
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "مجوز موردنظر پیدا نشد."
      });
    }

    removeFile(result.recordset[0].filePath);

    res.json({
      message: "مجوز با موفقیت حذف شد."
    });
  } catch (error) {
    console.error("Delete license error:", error);
    res.status(500).json({
      message: "حذف مجوز ناموفق بود."
    });
  }
});

module.exports = router;
