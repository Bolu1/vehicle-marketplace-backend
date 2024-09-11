import Joi from 'joi';

export const createListingValidator = Joi.object({
  name: Joi.string().required(),
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().integer().required(),
  price: Joi.number().positive().required(),
  mileage: Joi.number().positive().required(),
  gearType: Joi.string().required(),
  fuel: Joi.string().required(),
  color: Joi.string().required(),
});