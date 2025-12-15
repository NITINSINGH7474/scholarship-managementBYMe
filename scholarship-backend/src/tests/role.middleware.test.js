const request = require("supertest");
const express = require("express");
const { roleMiddleware } = require("../middlewares/roleCheck.middleware");

describe("roleMiddleware", () => {
  let app;

  beforeEach(() => {
    app = express();

    // mock protected route
    app.get(
      "/api/protected",
      // inject mock user role if header provided
      (req, res, next) => {
        const role = req.header("x-role");
        if (role) req.userRole = role;
        next();
      },
      roleMiddleware(["admin", "reviewer"]),
      (req, res) => res.json({ success: true, message: "Access granted" })
    );
  });

  test("should deny access when role missing", async () => {
    const res = await request(app).get("/api/protected");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      success: false,
      message: "Role missing",
    });
  });

  test("should deny access when role not allowed", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("x-role", "student");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      success: false,
      message: "Forbidden",
    });
  });

  test("should allow access when role allowed (admin)", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("x-role", "admin");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Access granted",
    });
  });

  test("should allow access when role allowed (reviewer)", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("x-role", "reviewer");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Access granted",
    });
  });
});
