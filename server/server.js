
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const { poolPromise } = require("./config/db");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const consultationRoutes = require("./routes/consultations");
const customerRoutes = require("./routes/customers");
const licenseRoutes = require("./routes/licenses");
const siteInfoRoutes = require("./routes/siteInfo");

const app = express();

const trustProxy = process.env.TRUST_PROXY;

if (trustProxy) {
  app.set(
    "trust proxy",
    /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy
  );
}

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);


const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    }
  })
);

app.use(express.json());


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/site-info", siteInfoRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await poolPromise;
  } catch (error) {
    console.error("Could not connect to database.");
  }
});
