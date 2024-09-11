import express from "express";

const apiRoutes = express.Router();
import authenticationRoute from "./modules/authentication.route";
import listingRoute from "./modules/listing.route";
import bookingRoute from "./modules/booking.route";

apiRoutes.use("/authentication", authenticationRoute);
apiRoutes.use("/listing", listingRoute);
apiRoutes.use("/booking", bookingRoute);

export default apiRoutes;
