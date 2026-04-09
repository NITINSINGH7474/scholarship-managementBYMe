const cors = require("cors");

const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // Allow specific origin in prod, all in dev
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
