function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.userRole; // injected by test

    if (!role) {
      return res
        .status(403)
        .json({ success: false, message: "Role missing" });
    }

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    next();
  };
}

module.exports = { roleMiddleware };
