import { IUser } from "../models/interfaces/user.interface";
import Jwt from "../utils/security/jwt";
import { Request, Response, NextFunction } from "express";
import UserService from "../service/user.service";
import {
  ForbiddenError,
  BadRequestError,
  UnauthorizedError,
} from "../core/api/ApiError";

// Middleware to check if the user is authorized
export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string | undefined =
      req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new BadRequestError("Token is missing");
    }

    const decoded = Jwt.verify(token as string);

    const loggedInUser = await UserService.readUserById(
      decoded.payload.id
    );

    if (!loggedInUser) {
      throw new UnauthorizedError();
    }

    res.locals.user = loggedInUser;

    next();
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
};

// Middleware to check if the user is a superuser
export const isSuperUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string | undefined =
      req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new BadRequestError("Token is missing");
    }

    const decoded = Jwt.verify(token as string);

    const loggedInUser = await UserService.readUserById(
      decoded.payload.id
    );

    if (!loggedInUser) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (loggedInUser.role !== "SUPERUSER") {
      throw new ForbiddenError("Permission Denied");
    }

    res.locals.user = loggedInUser;

    next();
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
};
