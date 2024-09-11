import db from "../core/config/db";
import {
  IListing,
  IListingFromDB,
  ICreateListingPayload,
  IReadListingFilters,
} from "../models/interfaces/listing.interface";

class ListingService {
  public static async createListing(
    payload: ICreateListingPayload,
    createdBy: string
  ): Promise<IListing> {
    const { name, make, model, year, price, mileage, gearType, fuel, color } =
      payload;

    const result = await db.query(
      `
      INSERT INTO "listing" ("name", "make", "model", "year", "price", "mileage", "gearType", "fuel", "color", "createdBy")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        name,
        make,
        model,
        year,
        price,
        mileage,
        gearType,
        fuel,
        color,
        createdBy,
      ]
    );

    return result.rows[0];
  }

  public static async readListings(
    filters: IReadListingFilters,
    limit: number,
    offset: number
  ): Promise<{ total: number; listings: IListingFromDB[] }> {
    const {
      name,
      make,
      model,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      minMileage,
      maxMileage,
      gearType,
      fuel,
      color,
    } = filters;

    // Read the number of records that meet the search parameter
    const countResult = await db.query(
      `
      SELECT COUNT(*) FROM "listing"
      WHERE 
          ($1::text IS NULL OR LOWER("name") LIKE LOWER($1)) AND
          ($2::text IS NULL OR LOWER("make") LIKE LOWER($2)) AND
          ($3::text IS NULL OR LOWER("model") LIKE LOWER($3)) AND
          ($4::int IS NULL OR "year" BETWEEN $4 AND $5) AND
          ($6::float IS NULL OR "price" BETWEEN $6 AND $7) AND
          ($8::float IS NULL OR "mileage" BETWEEN $8 AND $9) AND
          ($10::text IS NULL OR LOWER("gearType") = LOWER($10)) AND
          ($11::text IS NULL OR LOWER("fuel") = LOWER($11)) AND
          ($12::text IS NULL OR LOWER("color") = LOWER($12))
      `,
      [
        name ? `%${name}%` : null,
        make ? `%${make}%` : null,
        model ? `%${model}%` : null,
        minYear || null,
        maxYear || null,
        minPrice || null,
        maxPrice || null,
        minMileage || null,
        maxMileage || null,
        gearType ? gearType : null,
        fuel ? fuel : null,
        color ? color : null,
      ]
    );

    const total = parseInt(countResult.rows[0].count, 10);

    const currentDate = new Date().toISOString();

    // Search for records that match the filter, and include a field to reflect booking status also sorting the reocrds showing avilable listing first
    const result = await db.query(
      `
      SELECT l.*, 
             EXISTS (
               SELECT 1 FROM "booking" b 
               WHERE l."id" = b."listingId"
               AND $13 BETWEEN b."startDate" AND b."endDate"
             ) AS "isCurrentlyBooked"
      FROM "listing" l
      WHERE 
          ($1::text IS NULL OR LOWER(l."name") LIKE LOWER($1)) AND
          ($2::text IS NULL OR LOWER(l."make") LIKE LOWER($2)) AND
          ($3::text IS NULL OR LOWER(l."model") LIKE LOWER($3)) AND
          ($4::int IS NULL OR l."year" BETWEEN $4 AND $5) AND
          ($6::float IS NULL OR l."price" BETWEEN $6 AND $7) AND
          ($8::float IS NULL OR l."mileage" BETWEEN $8 AND $9) AND
          ($10::text IS NULL OR LOWER(l."gearType") = LOWER($10)) AND
          ($11::text IS NULL OR LOWER(l."fuel") = LOWER($11)) AND
          ($12::text IS NULL OR LOWER(l."color") = LOWER($12))
    ORDER BY "isCurrentlyBooked" ASC, l."id"
      LIMIT $14 OFFSET $15;
      `,
      [
        name ? `%${name}%` : null,
        make ? `%${make}%` : null,
        model ? `%${model}%` : null,
        minYear || null,
        maxYear || null,
        minPrice || null,
        maxPrice || null,
        minMileage || null,
        maxMileage || null,
        gearType ? gearType : null,
        fuel ? fuel : null,
        color ? color : null,
        currentDate,
        limit,
        offset,
      ]
    );

    return {
      total,
      listings: result.rows,
    };
  }

  public static async readListingById(
    id: string
  ): Promise<IListingFromDB | null> {
    // Read a record by it's ID and also return the list of future bookings
    const listingResult = await db.query(
      `
      SELECT l.*, 
             EXISTS (
               SELECT 1 FROM "booking" b 
               WHERE l."id" = b."listingId"
               AND NOW() BETWEEN b."startDate" AND b."endDate"
             ) AS "isCurrentlyBooked"
      FROM "listing" l
      WHERE l."id" = $1
      `,
      [id]
    );

    const listing = listingResult.rows[0];
    if (!listing) return null;

    const bookingsResult = await db.query(
      `
      SELECT "startDate", "endDate"
      FROM "booking"
      WHERE "listingId" = $1 AND "endDate" >= NOW()
      ORDER BY "startDate"
      `,
      [id]
    );

    listing.bookings = bookingsResult.rows;

    return listing;
  }
}

export default ListingService;