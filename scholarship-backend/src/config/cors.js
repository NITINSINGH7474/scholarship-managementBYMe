const cors = require("cors");

const corsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
