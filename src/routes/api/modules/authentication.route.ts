import express from "express";
import { loginUserValidator, registerUserValidator } from "../../../models/validations/authentication.validation";
import {validateRequest} from "../../../middlewares/validator";
import { loginUser, registerUser } from "../../../controllers/authentication.controller";

const router = express.Router();

router.post("/register", validateRequest(registerUserValidator), registerUser);
router.post("/login", validateRequest(loginUserValidator), loginUser);

export default router;
