import { Router } from "express";
import {
  loginAccount,
  registerAccount,
  verifyAccount,
} from "../controllers/signUp.controller.js";
import {
  loginUserRequestSchema,
  registerUserRequestSchema,
  verifyUserRequestSchema,
} from "./validationSchemas/userAuth.validation.js";
import { validateRequest } from "../utils/validate.util.js";
import { attachRole } from "../middlewares/attachRole.middleware.js";
import { UserTypeEnum } from "../constants/common.js";

const router = Router();

router
  .route("/user/register")
  .post(
    validateRequest(registerUserRequestSchema),
    attachRole(UserTypeEnum.user),
    registerAccount
  );

router
  .route("/user/verify/:token")
  .get(
    validateRequest(verifyUserRequestSchema),
    attachRole(UserTypeEnum.user),
    verifyAccount
  );

router
  .route("/user/login")
  .post(
    validateRequest(loginUserRequestSchema),
    attachRole(UserTypeEnum.user),
    loginAccount
  );

export default router;
