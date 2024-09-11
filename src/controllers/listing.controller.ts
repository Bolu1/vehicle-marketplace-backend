import asyncHandler from "../middlewares/async";
import { query, Request, Response } from "express";
import { CreatedResponse, SuccessResponse } from "../core/api/ApiResponse";
import {
  ICreateListingPayload,
  IReadListingFilters,
} from "../models/interfaces/listing.interface";
import ListingService from "../service/listing.service";
import { IUser } from "../models/interfaces/user.interface";
import { NotFoundError } from "../core/api/ApiError";

export const createListing = asyncHandler(
  async (req: Request, res: Response) => {
    const payload: ICreateListingPayload = req.body;
    const loggedInUser: IUser = res.locals.user;

    const listing = await ListingService.createListing(
      payload,
      loggedInUser.id
    );
    return new CreatedResponse("Listing created successfully", listing).send(
      res
    );
  }
);

export const getListings = asyncHandler(async (req: Request, res: Response) => {
  // Extract search query from URL query
  const filters: IReadListingFilters = {
    name: req.query.name?.toString(),
    make: req.query.make?.toString(),
    model: req.query.model?.toString(),
    minYear: req.query.min_year ? parseInt(req.query.min_year as string, 10) : undefined,
    maxYear: req.query.max_year ? parseInt(req.query.max_year as string, 10) : undefined,
    minPrice: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
    maxPrice: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
    minMileage: req.query.min_mileage ? parseFloat(req.query.min_mileage as string) : undefined,
    maxMileage: req.query.max_mileage ? parseFloat(req.query.max_mileage as string) : undefined,
    gearType: req.query.gear_type?.toString(),
    fuel: req.query.fuel?.toString(),
    color: req.query.color?.toString(), 
  };

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const offset = req.query.page
    ? (parseInt(req.query.page as string, 10) - 1) * limit
    : 0;

  const listings = await ListingService.readListings(filters, limit, offset);

  return new SuccessResponse("Listings retrieved successfully", listings).send(res);
});

export const getListingById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const listing = await ListingService.readListingById(id);

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    return new SuccessResponse("Listing retrieved successfully", listing).send(
      res
    );
  }
);
