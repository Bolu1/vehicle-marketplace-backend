import asyncHandler from "../middlewares/async";
import { Request, Response } from "express";
import { CreatedResponse, SuccessResponse } from "../core/api/ApiResponse";
import AuthenticationService from "../service/authentication.service";
import UserService from "../service/user.service";
import Jwt from "../utils/security/jwt";
import Bcrypt from "../utils/security/bcrypt";
import { sanitizeUser } from "../utils/helpers/db";
import {
  ILoginUserPayload,
  ILoginUserResponseData,
  IRegisterUserPayload,
} from "../models/interfaces/authentication.interface";
import { IUser } from "../models/interfaces/user.interface";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../core/api/ApiError";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const registerUserPayload: IRegisterUserPayload = req.body;

    const existingUser = await UserService.readUserByEmail(
      registerUserPayload.email
    );

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    // Hash user's password
    registerUserPayload.password = await Bcrypt.hashPassword(
      registerUserPayload.password
    );

    const newUser: IUser =
      await AuthenticationService.signup(registerUserPayload);
    return new CreatedResponse("User created successfully", newUser).send(res);
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const loginUserPayload: ILoginUserPayload = req.body;

  const loggedInUser = await UserService.readUnsanitizedUserByEmail(
    loginUserPayload.email
  );

  // Return error if user doesn't exist or the password doesn't match
  if (
    !loggedInUser ||
    !(await Bcrypt.compare(loginUserPayload.password, loggedInUser.password))
  ) {
    throw new BadRequestError("Invalid login credentials");
  }

  if (loggedInUser.status !== "ACTIVE") {
    throw new ForbiddenError("This account is inactive");
  }

  const token = Jwt.issue({ id: loggedInUser.id }, "30d");

  const responseData: ILoginUserResponseData = {
    token,
    loggedInUser: sanitizeUser(loggedInUser),
  };

  // Update last login
  AuthenticationService.updateLastLogin(loggedInUser.id);

  return new SuccessResponse("Login successful", responseData).send(res);
});
