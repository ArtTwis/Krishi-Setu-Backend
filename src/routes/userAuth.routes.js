import { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/userAuth.controller.js";
import {
  loginUserRequestSchema,
  registerUserRequestSchema,
  verifyUserRequestSchema,
} from "./validationSchemas/userAuth.validation.js";
import { validateRequest } from "../utils/validate.util.js";

const router = Router();

router
  .route("/user/register")
  .post(validateRequest(registerUserRequestSchema), registerUser);

router
  .route("/user/verify/:token")
  .get(validateRequest(verifyUserRequestSchema), verifyUser);

router
  .route("/user/login")
  .post(validateRequest(loginUserRequestSchema), loginUser);

export default router;
