import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

app.post("/api/v1/workspaces", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false });
  }

  return res.status(201).json({
    success: true,
    data: { name },
  });
});

describe("Workspace API", () => {
  it("should create a workspace", async () => {
    const res = await request(app)
      .post("/api/v1/workspaces")
      .send({ name: "Engineering Team" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Engineering Team");
  });

  it("should reject empty workspace name", async () => {
    const res = await request(app)
      .post("/api/v1/workspaces")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});