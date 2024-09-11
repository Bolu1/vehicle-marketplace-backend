import request from "supertest";
import app from "../../src/app";
import db from "../../src/core/config/db";
import Jwt from "../../src/utils/security/jwt";

let authToken: string;
let listingId: string;
let bookingId: string;
let userId: string;

beforeAll(async () => {
  // Insert a SuperUser for authentication
  const superUser = await db.query(`
    INSERT INTO "users" ("firstName", "lastName", "email", "password", "role")
    VALUES ('Super', 'User', 'testadmin1@example.com', 'hashedpassword', 'SUPERUSER')
    RETURNING "id"
  `);

  userId = superUser.rows[0].id;
  authToken = Jwt.issue({ id: superUser.rows[0].id }, "1h");

  // Insert a listing to be used in tests
  const listing = await db.query(
    `
    INSERT INTO "listing" ("name", "make", "model", "year", "price", "mileage", "gearType", "fuel", "color", "createdBy")
    VALUES ('Test', 'BMW', 'X5', 2020, 50000, 10000, 'Automatic', 'Petrol', 'Black', $1)
    RETURNING "id"
  `,
    [superUser.rows[0].id]
  );

  listingId = listing.rows[0].id;
});

afterAll(async () => {
  // Clean up the database after tests
  await db.query('DELETE FROM "booking" WHERE "listingId" = $1', [listingId]);
  await db.query('DELETE FROM "listing" WHERE "id" = $1', [listingId]);
  await db.query(`DELETE FROM "users" WHERE "id" = $1`, [userId]);
  await db.end();
});

describe("POST /:id/book", () => {
  it("should create a new booking successfully with valid data", async () => {
    const newBooking = {
      startDate: "2024-08-20T00:00:00.000Z",
      endDate: "2024-08-25T00:00:00.000Z",
    };

    const response = await request(app)
      .post(`/api/v1/booking/${listingId}/book`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBooking);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toMatchObject({
      listingId,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
    });

    // Store the bookingId for the cancel test
    bookingId = response.body.data.id;
  });

  it("should return validation error for missing required fields", async () => {
    const incompleteBooking = {
      startDate: "2024-08-20T00:00:00.000Z",
    };

    const response = await request(app)
      .post(`/api/v1/booking/${listingId}/book`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(incompleteBooking);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe("DELETE /:id/cancel", () => {
  it("should return 403 if trying to cancel booking within 24 hours", async () => {
    const newBooking = await db.query(
      `
      INSERT INTO "booking" ("listingId", "userId", "startDate", "endDate", "status", "createdAt")
      VALUES ($1, $2, '2024-08-20T00:00:00.000Z', '2024-08-25T00:00:00.000Z', 'BOOKED', NOW())
      RETURNING "id"
    `,
      [listingId, userId]
    );

    const response = await request(app)
      .delete(`/api/v1/booking/${newBooking.rows[0].id}/cancel`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
