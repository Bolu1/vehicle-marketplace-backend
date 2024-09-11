import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../core/api/ApiError";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return next(new BadRequestError(errorMessage));
    }

    req.body = value;
    next();
  };
};