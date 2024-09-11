import request from "supertest";
import app from "../../src/app";
import db from "../../src/core/config/db";

describe("Authentication API", () => {
  let testUserId: string | undefined;

  afterAll(async () => {
    // Clean up the test users
    await db.query(`DELETE FROM "users" WHERE "email" LIKE '%@example.com'`);
    await db.end();
  });

  describe("POST authentication/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/authentication/register")
        .send({
          firstName: "Test",
          lastName: "Tester",
          email: "test.tester@example.com",
          password: "123456",
          role: "USER",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("test.tester@example.com");
      expect(response.body.data).not.toHaveProperty("password");

      // Store the user ID for cleanup
      testUserId = response.body.data.id;
    });

    it("should return an error if the email is already in use", async () => {
      const response = await request(app)
        .post("/api/v1/authentication/register")
        .send({
          firstName: "Test",
          lastName: "Tester",
          email: "test.tester@example.com",
          password: "123456",
          role: "USER",
        });

      console.log(response.status)
      console.log(response.body)
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email already in use");
    });
  });

  describe("POST authentication/login", () => {
    it("should log in an existing user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/authentication/login")
        .send({
          email: "test.tester@example.com",
          password: "123456",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it("should return an error if the password is incorrect", async () => {
      const response = await request(app)
        .post("/api/v1/authentication/login")
        .send({
          email: "test.tester@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid login credentials");
    });

    it("should return an error if the user testers not exist", async () => {
      const response = await request(app)
        .post("/api/v1/authentication/login")
        .send({
          email: "nonexistent@example.com",
          password: "123456",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid login credentials");
    });
  });
});