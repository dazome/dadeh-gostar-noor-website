
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { sql, poolPromise } = require("../config/db");

const router = express.Router();


router.get("/test", authMiddleware, (req, res) => {
  res.json({
    message: "دسترسی موفق بود.",
    user: req.user
  });
});


router.get("/consultations", authMiddleware, async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT id, name, phone, company, service,
             description, status, createdAt
      FROM ConsultationRequests
      ORDER BY createdAt DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Get consultations error:", error);
    res.status(500).json({
      message: "دریافت درخواست‌ها با خطا مواجه شد."
    });
  }
});


router.patch(
  "/consultations/:id/status",
  authMiddleware,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const allowedStatuses = ["new", "in_progress", "completed"];

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "شناسه یا وضعیت درخواست معتبر نیست."
        });
      }

      const pool = await poolPromise;

      const result = await pool.request()
        .input("id", sql.Int, id)
        .input("status", sql.NVarChar(50), status)
        .query(`
          UPDATE ConsultationRequests
          SET status = @status
          WHERE id = @id;

          SELECT @@ROWCOUNT AS affectedRows;
        `);

      if (result.recordset[0].affectedRows === 0) {
        return res.status(404).json({
          message: "درخواست موردنظر پیدا نشد."
        });
      }

      res.json({
        message: "وضعیت درخواست تغییر کرد."
      });
    } catch (error) {
      console.error("Update consultation error:", error);
      res.status(500).json({
        message: "تغییر وضعیت با خطا مواجه شد."
      });
    }
  }
);

router.delete("/consultations/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "شناسه درخواست معتبر نیست."
      });
    }

    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM ConsultationRequests
        WHERE id = @id;

        SELECT @@ROWCOUNT AS affectedRows;
      `);

    if (result.recordset[0].affectedRows === 0) {
      return res.status(404).json({
        message: "درخواست موردنظر پیدا نشد."
      });
    }

    res.json({
      message: "درخواست با موفقیت حذف شد."
    });
  } catch (error) {
    console.error("Delete consultation error:", error);
    res.status(500).json({
      message: "حذف درخواست با خطا مواجه شد."
    });
  }
});

module.exports = router;
