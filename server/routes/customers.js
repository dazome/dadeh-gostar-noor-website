
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const { sql, poolPromise } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const validateUploadedFile = require("../middleware/validateUploadedFile");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads/customers");

fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"]
};

const validateCustomerLogo = validateUploadedFile(allowedTypes);

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
    if (!allowedTypes[file.mimetype]) {
      return cb(new Error("فرمت لوگو باید JPG، PNG، WebP یا GIF باشد."));
    }

    cb(null, true);
  }
});

function handleLogoUpload(req, res, next) {
  upload.single("logo")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const message =
          error.code === "LIMIT_FILE_SIZE"
            ? "حجم لوگو نباید بیشتر از ۵ مگابایت باشد."
            : "آپلود لوگو با خطا مواجه شد.";

        return res.status(400).json({ message });
      }

      return res.status(400).json({
        message: error.message || "آپلود لوگو ناموفق بود."
      });
    }

    next();
  });
}

function removeFile(filePath) {
  if (
    typeof filePath !== "string" ||
    !filePath.startsWith("/uploads/customers/")
  ) {
    return;
  }

  const filename = path.basename(filePath);
  const fullPath = path.join(uploadDir, filename);

  fs.promises.unlink(fullPath).catch((error) => {
    if (error.code !== "ENOENT") {
      console.error("Customer logo deletion error:", error);
    }
  });
}

function cleanupUploadedFile(req) {
  if (req.file) {
    fs.promises.unlink(req.file.path).catch(() => {});
  }
}


router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT id, name, logo
      FROM Customers
      ORDER BY id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({
      message: "دریافت فهرست مشتریان ناموفق بود."
    });
  }
});


router.post(
  "/",
  authMiddleware,
  handleLogoUpload,
  validateCustomerLogo,
  async (req, res) => {
    try {
      const name = req.body.name;

      if (typeof name !== "string" || !name.trim()) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "نام مشتری الزامی است."
        });
      }

      if (name.trim().length > 255) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "نام مشتری نباید بیشتر از ۲۵۵ کاراکتر باشد."
        });
      }

      const logo = req.file
        ? `/uploads/customers/${req.file.filename}`
        : null;

      const pool = await poolPromise;

      const result = await pool.request()
        .input("name", sql.NVarChar(255), name.trim())
        .input("logo", sql.NVarChar(500), logo)
        .query(`
          INSERT INTO Customers (name, logo)
          OUTPUT INSERTED.id, INSERTED.name, INSERTED.logo
          VALUES (@name, @logo)
        `);

      res.status(201).json({
        message: "مشتری با موفقیت اضافه شد.",
        customer: result.recordset[0]
      });
    } catch (error) {
      cleanupUploadedFile(req);
      console.error("Create customer error:", error);
      res.status(500).json({
        message: "افزودن مشتری ناموفق بود."
      });
    }
  }
);


router.put(
  "/:id",
  authMiddleware,
  handleLogoUpload,
  validateCustomerLogo,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const name = req.body.name;

      if (!Number.isInteger(id) || id < 1) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "شناسه مشتری معتبر نیست."
        });
      }

      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 255
      ) {
        cleanupUploadedFile(req);
        return res.status(400).json({
          message: "نام مشتری الزامی است و باید حداکثر ۲۵۵ کاراکتر باشد."
        });
      }

      const pool = await poolPromise;

      const existing = await pool.request()
        .input("id", sql.Int, id)
        .query(`
          SELECT id, logo
          FROM Customers
          WHERE id = @id
        `);

      if (existing.recordset.length === 0) {
        cleanupUploadedFile(req);
        return res.status(404).json({
          message: "مشتری موردنظر پیدا نشد."
        });
      }

      const oldLogo = existing.recordset[0].logo;
      const newLogo = req.file
        ? `/uploads/customers/${req.file.filename}`
        : oldLogo;

      const result = await pool.request()
        .input("id", sql.Int, id)
        .input("name", sql.NVarChar(255), name.trim())
        .input("logo", sql.NVarChar(500), newLogo)
        .query(`
          UPDATE Customers
          SET name = @name, logo = @logo
          OUTPUT INSERTED.id, INSERTED.name, INSERTED.logo
          WHERE id = @id
        `);

      if (req.file && oldLogo && oldLogo !== newLogo) {
        removeFile(oldLogo);
      }

      res.json({
        message: "اطلاعات مشتری به‌روزرسانی شد.",
        customer: result.recordset[0]
      });
    } catch (error) {
      cleanupUploadedFile(req);
      console.error("Update customer error:", error);
      res.status(500).json({
        message: "ویرایش مشتری ناموفق بود."
      });
    }
  }
);


router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "شناسه مشتری معتبر نیست."
    });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM Customers
        OUTPUT DELETED.logo
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "مشتری موردنظر پیدا نشد."
      });
    }

    removeFile(result.recordset[0].logo);

    res.json({
      message: "مشتری با موفقیت حذف شد."
    });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({
      message: "حذف مشتری ناموفق بود."
    });
  }
});

module.exports = router;
