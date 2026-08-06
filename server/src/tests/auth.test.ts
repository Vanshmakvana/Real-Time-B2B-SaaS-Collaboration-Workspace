import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

app.post("/api/v1/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false });
  }

  return res.status(201).json({
    success: true,
    data: { name, email },
  });
});

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Prathmesh",
        email: "prathmesh@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("prathmesh@example.com");
  });

  it("should reject invalid registration data", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});