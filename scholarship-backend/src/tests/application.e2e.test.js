// src/tests/application.e2e.test.js

const mongoose = require("mongoose");

jest.setTimeout(25000);

 

// src/tests/application.e2e.test.js

jest.mock("../middlewares/auth.middleware.js", () => ({
  authMiddleware: (req, res, next) => {
    req.userId = req.headers["x-user-id"];   // <-- required
    req.userRole = req.headers["x-role"];    // <-- REQUIRED for permit()
    next();
  },
}));



jest.mock("../middlewares/roleCheck.middleware", () => {
  return {
    permit: () => (req, res, next) => {
      req.userRole = "admin"; // <-- force admin
      next();
    },
  };
});


const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
const redis = require("../config/redis");
const Scholarship = require("../models/Scholarship");
const Application = require("../models/Application");
const Document = require("../models/Document");
const path = require("path");
const fs = require("fs");

describe("Application API (E2E)", () => {
  beforeAll(async () => {
    await db.connectTest();
    await redis.flushall();

    // ensure uploads dir exists
    const storage = require("../utils/storage");
    if (!fs.existsSync(storage.UPLOAD_DIR)) {
      fs.mkdirSync(storage.UPLOAD_DIR, { recursive: true });
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await db.disconnect();
    await redis.quit();
  });

  afterEach(async () => {
    await Application.deleteMany({});
    await Document.deleteMany({});
    await Scholarship.deleteMany({});
    await redis.flushall();
  });

  test("Applicant creates draft, uploads a document and submits application; admin can list applications", async () => {
    const adminId = new mongoose.Types.ObjectId();
    const applicantId = new mongoose.Types.ObjectId();

    // create scholarship as admin
    const schPayload = {
      title: "AppFlow",
      provider: "Foundation",
      requiredDocuments: ["id"]
    };

    const schRes = await request(app)
      .post("/api/scholarships")
      .set("x-user-id", adminId.toString())
      .set("x-role", "ADMIN")
      .send(schPayload);

    expect(schRes.statusCode).toBe(201);
    const sch = schRes.body.scholarship;

    // upsert applicant profile
    await request(app)
      .post("/api/profile")
      .set("x-user-id", applicantId.toString())
      .set("x-role", "APPLICANT")
      .send({ family: { annualIncome: 10000 } });

    // create/update draft
    const draftRes = await request(app)
      .post(`/api/scholarships/${sch._id}/apply`)
      .set("x-user-id", applicantId.toString())
      .set("x-role", "APPLICANT")
      .send({ answers: { essay: "I need this scholarship" } });

    expect(draftRes.statusCode).toBe(200);
    const application = draftRes.body.application;
    expect(application).toBeDefined();

    // upload document
    const tmpFilePath = path.join(process.cwd(), "tests-temp-file.txt");
    fs.writeFileSync(tmpFilePath, "hello world");

    const uploadRes = await request(app)
      .post(`/api/applications/${application._id}/documents`)
      .set("x-user-id", applicantId.toString())
      .set("x-role", "APPLICANT")
      .attach("file", tmpFilePath);

    fs.unlinkSync(tmpFilePath);

    expect([200, 201]).toContain(uploadRes.statusCode);
    expect(uploadRes.body.document).toBeDefined();

    // submit
    const submitRes = await request(app)
      .post(`/api/applications/${application._id}/submit`)
      .set("x-user-id", applicantId.toString())
      .set("x-role", "APPLICANT");

    expect(submitRes.statusCode).toBe(200);
    expect(submitRes.body.application.status).toBe("SUBMITTED");

    // admin lists
    const listRes = await request(app)
      .get("/api/applications")
      .set("x-user-id", adminId.toString())
      .set("x-role", "ADMIN");

    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body.docs)).toBe(true);
    expect(listRes.body.total).toBeGreaterThanOrEqual(1);
  });

  test("Only owner can upload document to their application", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherId = new mongoose.Types.ObjectId();

    const sch = await Scholarship.create({ title: "Private" });

    // FIX: applicant must be a valid ObjectId
    const appDoc = await Application.create({
      scholarship: sch._id,
      applicant: ownerId
    });

    const tmpFilePath = path.join(process.cwd(), "tests-temp-file.txt");
    fs.writeFileSync(tmpFilePath, "hello world 2");

    const uploadRes = await request(app)
      .post(`/api/applications/${appDoc._id}/documents`)
      .set("x-user-id", otherId.toString())  // Not owner
      .set("x-role", "APPLICANT")
      .attach("file", tmpFilePath);

    fs.unlinkSync(tmpFilePath);

    expect(uploadRes.statusCode).toBe(403);
  });
});
