function permit(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.userRole; // set by auth.middleware.js

    if (!role) {
      return res
        .status(403)
        .json({ success: false, message: "User role not found" });
    }

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: insufficient role" });
    }

    next();
  };
}

module.exports = { permit };
