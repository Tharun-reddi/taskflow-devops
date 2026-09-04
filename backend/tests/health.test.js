import request from "supertest";
import app from "../src/server.js";

describe("Health API", () => {
  test("GET /api/health returns 200", async () => {
    const response = await request(app).get("/api/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
