// src/routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const scholarshipRoutes = require("./scholarship.routes");
const applicationRoutes = require("./application.routes");

const userRoutes = require("./user.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/scholarships", scholarshipRoutes);

router.use("/", applicationRoutes);

module.exports = router;
