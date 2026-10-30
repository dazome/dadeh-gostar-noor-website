
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const { sql, poolPromise } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const validateUploadedFile = require("../middleware/validateUploadedFile");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "../uploads/blog");

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

const validateBlogImage = validateUploadedFile({
  "image/jpeg": [".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"]
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    const extension = allowedMimeTypes[file.mimetype];
    callback(null, `${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes[file.mimetype]) {
      return callback(new Error("فرمت تصویر مجاز نیست."));
    }

    callback(null, true);
  }
});

function uploadImage(req, res, next) {
  upload.single("image")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const message =
          error.code === "LIMIT_FILE_SIZE"
            ? "حجم تصویر نباید بیشتر از ۵ مگابایت باشد."
            : "آپلود تصویر با خطا مواجه شد.";

        return res.status(400).json({ message });
      }

      return res.status(400).json({
        message: error.message || "آپلود تصویر ناموفق بود."
      });
    }

    next();
  });
}

function getImagePath(req) {
  return req.file ? `/uploads/blog/${req.file.filename}` : null;
}

function removeUploadedFile(req) {
  if (req.file) {
    fs.promises.unlink(req.file.path).catch((error) => {
      if (error.code !== "ENOENT") {
        console.error("Uploaded file cleanup error:", error);
      }
    });
  }
}

function removeStoredImage(imagePath) {
  if (
    typeof imagePath !== "string" ||
    !imagePath.startsWith("/uploads/blog/")
  ) {
    return;
  }

  const filename = path.basename(imagePath);
  const filePath = path.join(uploadDirectory, filename);

  fs.promises.unlink(filePath).catch((error) => {
    if (error.code !== "ENOENT") {
      console.error("Image deletion error:", error);
    }
  });
}


router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT *
      FROM BlogPosts
      ORDER BY date DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Get blog posts error:", error);
    res.status(500).json({
      message: "خطا در دریافت پست‌های وبلاگ."
    });
  }
});


router.get("/slug/:slug", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("slug", sql.NVarChar(255), req.params.slug)
      .query(`
        SELECT *
        FROM BlogPosts
        WHERE slug = @slug
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "مقاله مورد نظر پیدا نشد."
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Get blog post by slug error:", error);
    res.status(500).json({
      message: "خطا در دریافت مقاله."
    });
  }
});


router.get("/:id", async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({
      message: "شناسه پست معتبر نیست."
    });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, Number(req.params.id))
      .query(`
        SELECT *
        FROM BlogPosts
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "پست مورد نظر پیدا نشد."
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Get blog post error:", error);
    res.status(500).json({
      message: "خطا در دریافت پست."
    });
  }
});

router.post(
  "/",
  authMiddleware,
  uploadImage,
  validateBlogImage,
  async (req, res) => {
    try {
      const { title, slug, category, date, excerpt, content, icon } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof slug !== "string" ||
        !slug.trim() ||
        typeof category !== "string" ||
        !category.trim() ||
        !date ||
        typeof excerpt !== "string" ||
        !excerpt.trim() ||
        typeof content !== "string" ||
        !content.trim()
      ) {
        removeUploadedFile(req);
        return res.status(400).json({
          message: "اطلاعات ضروری را کامل وارد کنید."
        });
      }

      const image = getImagePath(req);
      const pool = await poolPromise;

      const result = await pool.request()
        .input("title", sql.NVarChar(255), title.trim())
        .input("slug", sql.NVarChar(255), slug.trim())
        .input("category", sql.NVarChar(255), category.trim())
        .input("date", sql.NVarChar(50), date)
        .input("excerpt", sql.NVarChar(sql.MAX), excerpt.trim())
        .input("content", sql.NVarChar(sql.MAX), content.trim())
        .input("icon", sql.NVarChar(100), icon || null)
        .input("image", sql.NVarChar(500), image)
        .query(`
          INSERT INTO BlogPosts
            (title, slug, category, date, excerpt, content, icon, image)
          OUTPUT INSERTED.*
          VALUES
            (@title, @slug, @category, @date, @excerpt, @content, @icon, @image)
        `);

      res.status(201).json({
        message: "پست با موفقیت ایجاد شد.",
        post: result.recordset[0]
      });
    } catch (error) {
      removeUploadedFile(req);
      console.error("Create blog post error:", error);

      if (error.number === 2627 || error.number === 2601) {
        return res.status(409).json({
          message: "این آدرس مطلب قبلاً ثبت شده است."
        });
      }

      res.status(500).json({
        message: "خطا در ایجاد پست."
      });
    }
  }
);


router.put(
  "/:id",
  authMiddleware,
  uploadImage,
  validateBlogImage,
  async (req, res) => {
    try {
      if (!/^\d+$/.test(req.params.id)) {
        removeUploadedFile(req);
        return res.status(400).json({
          message: "شناسه پست معتبر نیست."
        });
      }

      const { title, slug, category, date, excerpt, content, icon } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof slug !== "string" ||
        !slug.trim() ||
        typeof category !== "string" ||
        !category.trim() ||
        !date ||
        typeof excerpt !== "string" ||
        !excerpt.trim() ||
        typeof content !== "string" ||
        !content.trim()
      ) {
        removeUploadedFile(req);
        return res.status(400).json({
          message: "اطلاعات ضروری را کامل وارد کنید."
        });
      }

      const id = Number(req.params.id);
      const pool = await poolPromise;

      const oldPostResult = await pool.request()
        .input("id", sql.Int, id)
        .query(`
          SELECT image
          FROM BlogPosts
          WHERE id = @id
        `);

      if (oldPostResult.recordset.length === 0) {
        removeUploadedFile(req);
        return res.status(404).json({
          message: "پست مورد نظر پیدا نشد."
        });
      }

      const oldImage = oldPostResult.recordset[0].image;
      const newImage = getImagePath(req);

      const request = pool.request()
        .input("id", sql.Int, id)
        .input("title", sql.NVarChar(255), title.trim())
        .input("slug", sql.NVarChar(255), slug.trim())
        .input("category", sql.NVarChar(255), category.trim())
        .input("date", sql.NVarChar(50), date)
        .input("excerpt", sql.NVarChar(sql.MAX), excerpt.trim())
        .input("content", sql.NVarChar(sql.MAX), content.trim())
        .input("icon", sql.NVarChar(100), icon || null);

      if (newImage) {
        request.input("image", sql.NVarChar(500), newImage);
      }

      const result = await request.query(`
        UPDATE BlogPosts
        SET
          title = @title,
          slug = @slug,
          category = @category,
          date = @date,
          excerpt = @excerpt,
          content = @content,
          icon = @icon,
          image = ${newImage ? "@image" : "image"}
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

      if (result.recordset.length === 0) {
        removeUploadedFile(req);
        return res.status(404).json({
          message: "پست مورد نظر پیدا نشد."
        });
      }

      if (newImage && oldImage && oldImage !== newImage) {
        removeStoredImage(oldImage);
      }

      res.json({
        message: "پست با موفقیت ویرایش شد.",
        post: result.recordset[0]
      });
    } catch (error) {
      removeUploadedFile(req);
      console.error("Update blog post error:", error);

      if (error.number === 2627 || error.number === 2601) {
        return res.status(409).json({
          message: "این آدرس مطلب قبلاً ثبت شده است."
        });
      }

      res.status(500).json({
        message: "خطا در ویرایش پست."
      });
    }
  }
);


router.delete("/:id", authMiddleware, async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({
      message: "شناسه پست معتبر نیست."
    });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, Number(req.params.id))
      .query(`
        DELETE FROM BlogPosts
        OUTPUT DELETED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "پست مورد نظر پیدا نشد."
      });
    }

    removeStoredImage(result.recordset[0].image);

    res.json({
      message: "پست با موفقیت حذف شد."
    });
  } catch (error) {
    console.error("Delete blog post error:", error);
    res.status(500).json({
      message: "خطا در حذف پست."
    });
  }
});

module.exports = router;
