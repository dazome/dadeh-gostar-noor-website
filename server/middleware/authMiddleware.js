
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // بررسی تنظیمات ضروری سرور
  if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL) {
    console.error("JWT_SECRET or ADMIN_EMAIL is missing.");
    return res.status(500).json({
      message: "تنظیمات احراز هویت سرور کامل نیست."
    });
  }

  // توکن باید با فرمت Bearer ارسال شود
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "دسترسی غیرمجاز است."
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "توکن ارسال نشده است."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });

    // توکن باید اطلاعات مورد انتظار را داشته باشد
    if (
      !decoded ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string"
    ) {
      return res.status(401).json({
        message: "اطلاعات توکن معتبر نیست."
      });
    }

    // فقط حساب ادمین تعیین‌شده اجازه دسترسی دارد
    if (
      decoded.email.toLowerCase() !==
      process.env.ADMIN_EMAIL.trim().toLowerCase()
    ) {
      return res.status(403).json({
        message: "شما اجازه دسترسی به پنل مدیریت را ندارید."
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "توکن نامعتبر یا منقضی شده است."
    });
  }
}

module.exports = authMiddleware;
