const express = require("express");
const rateLimit = require("express-rate-limit");
const { sql, poolPromise } = require("../config/db");

const router = express.Router();


const consultationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً ۱۵ دقیقه بعد دوباره تلاش کنید."
  }
});

router.post("/", consultationLimiter, async (req, res) => {
  try {
    const {
      name,
      phone,
      company,
      service,
      description
    } = req.body || {};

  
    if (
      typeof name !== "string" ||
      typeof phone !== "string" ||
      !name.trim() ||
      !phone.trim()
    ) {
      return res.status(400).json({
        message: "نام و شماره تماس الزامی هستند."
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

   
    if (cleanName.length > 255 || cleanPhone.length > 50) {
      return res.status(400).json({
        message: "طول نام یا شماره تماس بیش از حد مجاز است."
      });
    }

    
    const optionalFields = {
      company,
      service,
      description
    };

    for (const [fieldName, value] of Object.entries(optionalFields)) {
      if (
        value !== undefined &&
        value !== null &&
        typeof value !== "string"
      ) {
        return res.status(400).json({
          message: `مقدار فیلد ${fieldName} معتبر نیست.`
        });
      }
    }

    const cleanCompany =
      typeof company === "string" ? company.trim() : "";

    const cleanService =
      typeof service === "string" ? service.trim() : "";

    const cleanDescription =
      typeof description === "string" ? description.trim() : "";

  
    if (
      cleanCompany.length > 255 ||
      cleanService.length > 255 ||
      cleanDescription.length > 3000
    ) {
      return res.status(400).json({
        message: "یکی از فیلدها بیش از حد طولانی است."
      });
    }

    const pool = await poolPromise;

    await pool.request()
      .input("name", sql.NVarChar(255), cleanName)
      .input("phone", sql.NVarChar(50), cleanPhone)
      .input(
        "company",
        sql.NVarChar(255),
        cleanCompany || null
      )
      .input(
        "service",
        sql.NVarChar(255),
        cleanService || null
      )
      .input(
        "description",
        sql.NVarChar(sql.MAX),
        cleanDescription || null
      )
      .query(`
        INSERT INTO ConsultationRequests
          (name, phone, company, service, description)
        VALUES
          (@name, @phone, @company, @service, @description)
      `);

    return res.status(201).json({
      message: "درخواست مشاوره شما با موفقیت ثبت شد."
    });
  } catch (error) {
    console.error("Create consultation error:", error.message);

    return res.status(500).json({
      message: "ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    });
  }
});

module.exports = router;
