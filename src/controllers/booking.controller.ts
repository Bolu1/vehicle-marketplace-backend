import asyncHandler from "../middlewares/async";
import { Request, Response } from "express";
import {
  CreatedResponse,
  SuccessResponse,
  ConflictResponse,
  NotFoundResponse,
  ForbiddenResponse,
} from "../core/api/ApiResponse";
import { ICreateBookingPayload } from "../models/interfaces/booking.interface";
import BookingService from "../service/booking.service";

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.body as ICreateBookingPayload;
    const userId = res.locals.user.id;
    const listingId = req.params.id;

    // Check if the selected time period is available
    const isTimeSlotAvailable = await BookingService.isTimeSlotAvailable(
      listingId,
      startDate,
      endDate
    );

    if (!isTimeSlotAvailable) {
      return new ConflictResponse(
        "The selected time period is already booked."
      ).send(res);
    }

    // Create the booking
    const booking = await BookingService.createBooking(
      { startDate, endDate },
      listingId,
      userId
    );

    return new CreatedResponse("Booking created successfully", booking).send(
      res
    );
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = res.locals.user.id;

    // Find the booking
    const booking = await BookingService.readBookingById(bookingId);

    if (!booking) {
      return new NotFoundResponse("Booking not found").send(res);
    }

    if (booking.userId !== userId) {
      return new ForbiddenResponse(
        "You do not have permission to cancel this booking"
      ).send(res);
    }

    const isBookingOlderThanADay = await BookingService.isBookingOlderThanADay(
      booking.createdAt
    );

    if (!isBookingOlderThanADay) {
      return new ForbiddenResponse(
        "Booking cannot be canceled within 24 hours of booking"
      ).send(res);
    }

    const canceledBooking = await BookingService.cancelBooking(bookingId);

    return new SuccessResponse(
      "Booking canceled successfully",
      canceledBooking
    ).send(res);
  }
);
