
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { sql, poolPromise } = require("../config/db");

const router = express.Router();

const fields = {
  companyName: { column: "companyName", type: sql.NVarChar(255), max: 255 },
  phone: { column: "phone", type: sql.NVarChar(50), max: 50 },
  email: { column: "email", type: sql.NVarChar(255), max: 255 },
  address: { column: "address", type: sql.NVarChar(1000), max: 1000 },
  postalCode: { column: "postalCode", type: sql.NVarChar(20), max: 20 }
};


router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT TOP 1 id, companyName, phone, email, address, postalCode
      FROM SiteInfo
      ORDER BY id ASC
    `);

    res.json(result.recordset[0] || null);
  } catch (error) {
    console.error("Get site info error:", error);
    res.status(500).json({
      message: "دریافت اطلاعات سایت با خطا مواجه شد."
    });
  }
});


router.put("/", authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      phone,
      email,
      address,
      postalCode
    } = req.body;

    if (
      typeof companyName !== "string" ||
      !companyName.trim() ||
      companyName.trim().length > 255
    ) {
      return res.status(400).json({
        message: "برای ثبت اولیه، نام شرکت الزامی است."
      });
    }

    const pool = await poolPromise;

    const existing = await pool.request().query(`
      SELECT TOP 1 id FROM SiteInfo ORDER BY id ASC
    `);

    if (existing.recordset.length > 0) {
      return res.status(409).json({
        message: "اطلاعات شرکت قبلاً ثبت شده است. از ویرایش جزئی استفاده کنید."
      });
    }

    const request = pool.request();

    for (const key of Object.keys(fields)) {
      const value = req.body[key];

      if (value != null && typeof value !== "string") {
        return res.status(400).json({
          message: `مقدار فیلد ${key} معتبر نیست.`
        });
      }

      if (typeof value === "string" && value.length > fields[key].max) {
        return res.status(400).json({
          message: `طول فیلد ${key} بیش از حد مجاز است.`
        });
      }

      request.input(
        key,
        fields[key].type,
        typeof value === "string" && value.trim()
          ? value.trim()
          : null
      );
    }

    await request.query(`
      INSERT INTO SiteInfo
        (companyName, phone, email, address, postalCode)
      VALUES
        (@companyName, @phone, @email, @address, @postalCode)
    `);

    const saved = await pool.request().query(`
      SELECT TOP 1 id, companyName, phone, email, address, postalCode
      FROM SiteInfo
      ORDER BY id ASC
    `);

    res.status(201).json({
      message: "اطلاعات شرکت با موفقیت ثبت شد.",
      siteInfo: saved.recordset[0]
    });
  } catch (error) {
    console.error("Create site info error:", error);
    res.status(500).json({
      message: "ثبت اطلاعات شرکت با خطا مواجه شد."
    });
  }
});


router.patch("/", authMiddleware, async (req, res) => {
  try {
    const keys = Object.keys(fields);
    const submittedKeys = keys.filter((key) =>
      Object.prototype.hasOwnProperty.call(req.body, key)
    );

    if (submittedKeys.length === 0) {
      return res.status(400).json({
        message: "هیچ تغییری برای ذخیره ارسال نشده است."
      });
    }

    for (const key of submittedKeys) {
      const value = req.body[key];

      if (value !== null && typeof value !== "string") {
        return res.status(400).json({
          message: `مقدار فیلد ${key} معتبر نیست.`
        });
      }

      if (typeof value === "string" && value.length > fields[key].max) {
        return res.status(400).json({
          message: `طول فیلد ${key} بیش از حد مجاز است.`
        });
      }

      if (key === "companyName" && !value?.trim()) {
        return res.status(400).json({
          message: "نام شرکت نمی‌تواند خالی باشد."
        });
      }
    }

    const pool = await poolPromise;

    const existing = await pool.request().query(`
      SELECT TOP 1 id FROM SiteInfo ORDER BY id ASC
    `);

    if (existing.recordset.length === 0) {
      return res.status(404).json({
        message: "اطلاعات شرکت هنوز ثبت نشده است. ابتدا نام شرکت را ثبت کنید."
      });
    }

    const id = existing.recordset[0].id;
    const request = pool.request();
    request.input("id", sql.Int, id);

    const assignments = submittedKeys.map((key) => {
      const value = req.body[key];

      request.input(
        key,
        fields[key].type,
        typeof value === "string" && value.trim()
          ? value.trim()
          : null
      );

      return `${fields[key].column} = @${key}`;
    });

    await request.query(`
      UPDATE SiteInfo
      SET ${assignments.join(", ")}
      WHERE id = @id
    `);

    const saved = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT id, companyName, phone, email, address, postalCode
        FROM SiteInfo
        WHERE id = @id
      `);

    res.json({
      message: "تغییرات با موفقیت ذخیره شد.",
      siteInfo: saved.recordset[0]
    });
  } catch (error) {
    console.error("Update site info error:", error);
    res.status(500).json({
      message: "ذخیره تغییرات با خطا مواجه شد."
    });
  }
});

module.exports = router;
