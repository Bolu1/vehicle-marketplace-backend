import Joi from "joi";

export const createBookingValidator = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});
