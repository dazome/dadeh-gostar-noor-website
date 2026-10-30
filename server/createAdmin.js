
require("dotenv").config();

const bcrypt = require("bcrypt");
const { sql, poolPromise } = require("./config/db");

async function createAdmin() {
  let pool;

  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_INITIAL_PASSWORD;

    if (!email) {
      throw new Error("ADMIN_EMAIL is missing from .env");
    }

    pool = await poolPromise;


    const existing = await pool.request()
      .input("email", sql.NVarChar(255), email)
      .query(`
        SELECT id
        FROM Users
        WHERE LOWER(email) = @email
      `);

    if (existing.recordset.length > 0) {
      console.log("Admin already exists. No changes were made.");
      return;
    }

    if (typeof password !== "string" || password.length < 12) {
      throw new Error(
        "ADMIN_INITIAL_PASSWORD must be at least 12 characters."
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.request()
      .input("email", sql.NVarChar(255), email)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .query(`
        INSERT INTO Users (email, passwordHash)
        VALUES (@email, @passwordHash)
      `);

    console.log("Admin created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (pool) {
      await pool.close().catch(() => {});
    }
  }
}

createAdmin();
