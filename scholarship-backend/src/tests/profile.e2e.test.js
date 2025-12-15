// src/tests/profile.e2e.test.js
jest.setTimeout(20000);

// Mock auth & role middleware so tests control userId/role via headers
jest.mock("../middlewares/auth.middleware", () => {
  return {
    authMiddleware: (req, res, next) => {
      req.userId = req.headers["x-user-id"] || "u123";
      req.userRole = req.headers["x-role"] || "APPLICANT";
      next();
    },
  };
});

jest.mock("../middlewares/roleCheck.middleware", () => {
  return {
    permit:
      (allowed = []) =>
      (req, res, next) => {
        const role = req.headers["x-role"] || req.userRole;
        if (!allowed.includes(role))
          return res.status(403).json({ success: false, message: "Forbidden" });
        next();
      },
  };
});

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
const redis = require("../config/redis");
const Profile = require("../models/Profile");
const User = require("../models/User");     // <-- REQUIRED FIX
const mongoose = require("mongoose");

describe("Profile API (E2E)", () => {
  beforeAll(async () => {
    await db.connectTest();
    await redis.flushall();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await db.disconnect();
    await redis.quit();
  });

  afterEach(async () => {
    await Profile.deleteMany({});
    await User.deleteMany({});            // <-- CLEAR USERS TOO
    await redis.flushall();
  });

  test("Applicant can upsert and read their profile", async () => {
    const userId = new mongoose.Types.ObjectId();

    // ⭐ CREATE USER in DB (FIX)
    await User.create({
      _id: userId,
      name: "Test User",
      email: "test@example.com",
      password: "x",
      role: "APPLICANT",
    });

    const profilePayload = {
      dob: "1995-01-01",
      gender: "male",
      address: { line1: "123", city: "Mumbai", country: "IN" },
      family: { annualIncome: 50000 },
      education: [
        {
          institution: "Test Uni",
          degree: "BSc",
          startYear: 2013,
          endYear: 2016,
        },
      ],
    };

    const res = await request(app)
      .post("/api/profile")
      .set("x-user-id", userId.toString())
      .set("x-role", "APPLICANT")
      .send(profilePayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.profile.user).toBe(userId.toString());
    expect(res.body.profile.gender).toBe("male");

    const res2 = await request(app)
      .get("/api/profile/me")
      .set("x-user-id", userId.toString())
      .set("x-role", "APPLICANT");

    expect(res2.statusCode).toBe(200);
    expect(res2.body.profile.gender).toBe("male");
  });

  test("Admin can fetch arbitrary profile by id", async () => {
    const userId = new mongoose.Types.ObjectId();

    // ⭐ REQUIRED: Create user
    await User.create({
      _id: userId,
      name: "Admin User",
      email: "admin@example.com",
      password: "x",
      role: "APPLICANT",
    });

    const profile = await Profile.create({ user: userId, gender: "female" });

    const res = await request(app)
      .get(`/api/profile/${profile._id}`)
      .set("x-user-id", new mongoose.Types.ObjectId().toString())
      .set("x-role", "ADMIN");

    expect(res.statusCode).toBe(200);
    expect(res.body.profile.gender).toBe("female");
  });

  test("Non-admin cannot fetch arbitrary profile", async () => {
    const userId = new mongoose.Types.ObjectId();

    // ⭐ REQUIRED: Create user
    await User.create({
      _id: userId,
      name: "A",
      email: "a@example.com",
      password: "x",
      role: "APPLICANT",
    });

    const profile = await Profile.create({ user: userId, gender: "female" });

    const res = await request(app)
      .get(`/api/profile/${profile._id}`)
      .set("x-user-id", new mongoose.Types.ObjectId().toString())
      .set("x-role", "APPLICANT");

    expect(res.statusCode).toBe(403);
  });
});
