import request from "supertest";
import app from "../../src/app";
import db from "../../src/core/config/db";
import Jwt from "../../src/utils/security/jwt";

let authToken: string;
let userId: string;

beforeAll(async () => {
  const superUser = await db.query(`
    INSERT INTO "users" ("firstName", "lastName", "email", "password", "role")
    VALUES ('Super', 'User', 'testadmin@example.com', 'hashedpassword', 'SUPERUSER')
    RETURNING "id"
  `);

  userId = superUser.rows[0].id;
  authToken = Jwt.issue({ id: superUser.rows[0].id }, "1h");
});

afterAll(async () => {
  await db.query(`DELETE FROM "listing" WHERE "createdBy" = $1`, [userId]);
  await db.query(`DELETE FROM "users" WHERE "id" = $1`, [userId]);
  await db.end();
});

describe("POST /listing", () => {
  it("should create a new listing successfully with valid data", async () => {
    const newListing = {
      name: "Luxury Sedan",
      make: "BMW",
      model: "X5",
      year: 2020,
      price: 50000,
      mileage: 10000,
      gearType: "Automatic",
      fuel: "Petrol",
      color: "Black",
    };

    const response = await request(app)
      .post("/api/v1/listing")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newListing);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject(newListing);
  });

  it("should return validation error for missing required fields", async () => {
    const incompleteListing = {
      make: "BMW",
      model: "X5",
    };

    const response = await request(app)
      .post("/api/v1/listing")
      .set("Authorization", `Bearer ${authToken}`)
      .send(incompleteListing);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
