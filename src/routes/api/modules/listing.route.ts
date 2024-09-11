import express from "express";
import { createListingValidator } from "../../../models/validations/listing.validation";
import {validateRequest} from "../../../middlewares/validator";
import { createListing, getListingById, getListings } from "../../../controllers/listing.controller";
import { isSuperUser, isAuthorized } from "../../../middlewares/authentication";

const router = express.Router();

router.post("/", isSuperUser, validateRequest(createListingValidator), createListing);
router.get("/", isAuthorized, getListings);
router.get("/:id", isAuthorized, getListingById);

export default router;
