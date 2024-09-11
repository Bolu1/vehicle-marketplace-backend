import db from "../core/config/db";
import {
  IBooking,
  ICreateBookingPayload,
} from "../models/interfaces/booking.interface";

class BookingService {
  public static async createBooking(
    payload: ICreateBookingPayload,
    listingId: string,
    userId: string
  ): Promise<IBooking> {
    const { startDate, endDate } = payload;
    const result = await db.query(
      `
      INSERT INTO "booking" ("listingId", "userId", "startDate", "endDate")
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [listingId, userId, startDate, endDate]
    );

    return result.rows[0];
  }

  public static async readBookingById(
    bookingId: string
  ): Promise<IBooking | null> {
    const result = await db.query(`SELECT * FROM "booking" WHERE "id" = $1`, [
      bookingId,
    ]);
    return result.rows[0] || null;
  }

  public static async isTimeSlotAvailable(
    listingId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const result = await db.query(
      `
      SELECT 1 FROM "booking"
      WHERE "listingId" = $1 AND "status" = 'BOOKED'
      AND ($2::timestamp, $3::timestamp) OVERLAPS ("startDate", "endDate")
      `,
      [listingId, startDate, endDate]
    );

    return result.rows.length === 0;
  }

  public static async isBookingOlderThanADay(bookedAt: Date): Promise<boolean> {
    const differenceInHours =
      (Date.now() - new Date(bookedAt).getTime()) / (1000 * 60 * 60);
    return differenceInHours > 24;
  }

  public static async cancelBooking(bookingId: string): Promise<IBooking> {
    const result = await db.query(
      `
      UPDATE "booking" 
      SET "status" = 'CANCELLED', "updatedAt" = NOW()
      WHERE "id" = $1
      RETURNING *
      `,
      [bookingId]
    );

    return result.rows[0];
  }
}

export default BookingService;
