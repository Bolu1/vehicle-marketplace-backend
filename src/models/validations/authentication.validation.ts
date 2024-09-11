import Joi from 'joi';

export const registerUserValidator = Joi.object({
  firstName: Joi.string().min(2).max(255).required(),
  lastName: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("SUPERUSER", "USER").required() 
});

export const loginUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});