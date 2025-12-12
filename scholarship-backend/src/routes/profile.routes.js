const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/profile.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { permit } = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.post("/", ctrl.upsertProfile);

router.get("/me", ctrl.getMyProfile);

router.get(
  "/:id",
  permit(["ADMIN", "SUPER_ADMIN", "REVIEWER"]),
  ctrl.getProfile
);

module.exports = router;
