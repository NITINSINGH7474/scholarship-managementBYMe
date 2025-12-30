const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
