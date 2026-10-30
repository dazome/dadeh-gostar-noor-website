
const fs = require("fs/promises");
const path = require("path");

function validateUploadedFile(allowedTypes) {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      const { fileTypeFromFile } = await import("file-type");
      const detected = await fileTypeFromFile(req.file.path);
      const extension = path.extname(req.file.filename).toLowerCase();

      const validExtensions = detected
        ? allowedTypes[detected.mime]
        : null;

      const isValid =
        detected &&
        validExtensions &&
        detected.mime === req.file.mimetype &&
        validExtensions.includes(extension);

      if (!isValid) {
        await fs.unlink(req.file.path).catch(() => {});

        return res.status(400).json({
          message: "محتوای فایل یا فرمت آن معتبر نیست."
        });
      }

      next();
    } catch (error) {
      await fs.unlink(req.file.path).catch(() => {});
      console.error("File validation error:", error.message);

      return res.status(500).json({
        message: "بررسی امنیتی فایل با خطا مواجه شد."
      });
    }
  };
}

module.exports = validateUploadedFile;
