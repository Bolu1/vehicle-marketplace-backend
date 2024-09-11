import express from "express";
import { createBookingValidator } from "../../../models/validations/booking.validation";
import {validateRequest} from "../../../middlewares/validator";
import { cancelBooking, createBooking} from "../../../controllers/booking.controller";
import { isAuthorized } from "../../../middlewares/authentication";

const router = express.Router();

router.post("/:id/book", isAuthorized, validateRequest(createBookingValidator), createBooking);
router.delete("/:id/cancel", isAuthorized, cancelBooking);

export default router;
