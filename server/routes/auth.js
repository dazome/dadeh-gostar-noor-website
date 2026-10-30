const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const { sql, poolPromise } = require("../config/db");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "تعداد تلاش‌های ورود بیش از حد مجاز است. ۱۵ دقیقه بعد دوباره تلاش کنید."
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL) {
      console.error("JWT_SECRET or ADMIN_EMAIL is missing.");

      return res.status(500).json({
        message: "تنظیمات احراز هویت سرور کامل نیست."
      });
    }

    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "ایمیل و رمز عبور الزامی است."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();

    
    if (normalizedEmail !== adminEmail) {
      return res.status(401).json({
        message: "ایمیل یا رمز عبور اشتباه است."
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("email", sql.NVarChar(255), adminEmail)
      .query(`
        SELECT id, email, passwordHash
        FROM Users
        WHERE email = @email
      `);

    if (result.recordset.length !== 1) {
      return res.status(401).json({
        message: "ایمیل یا رمز عبور اشتباه است."
      });
    }

    const user = result.recordset[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "ایمیل یا رمز عبور اشتباه است."
      });
    }

   
    const userId = Number(user.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      console.error("Invalid admin user ID.");

      return res.status(500).json({
        message: "شناسه حساب ادمین معتبر نیست."
      });
    }

    const token = jwt.sign(
      {
        id: userId,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        algorithm: "HS256"
      }
    );

    return res.json({
      message: "ورود موفق بود.",
      token,
      user: {
        id: userId,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "خطایی در سرور رخ داد."
    });
  }
});

module.exports = router;
