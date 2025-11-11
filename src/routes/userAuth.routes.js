import { Router } from "express";
import {
  loginAccount,
  registerAccount,
  verifyAccount,
  logoutAccount,
  reGenerateAccessToken,
} from "../controllers/auth.controller.js";
import {
  loginUserRequestSchema,
  logoutUserRequestSchema,
  registerUserRequestSchema,
  verifyUserRequestSchema,
} from "./validationSchemas/userAuth.validation.js";
import { validateRequest } from "../utils/validate.util.js";
import { attachRole } from "../middlewares/attachRole.middleware.js";
import { UserTypeEnum } from "../constants/common.js";
import { verifyJwtToken } from "../utils/auth.util.js";

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

router
  .route("/user/logout")
  .post(
    validateRequest(logoutUserRequestSchema),
    attachRole(UserTypeEnum.user),
    verifyJwtToken,
    logoutAccount
  );

router
  .route("/user/regenerateToken")
  .post(attachRole(UserTypeEnum.user), reGenerateAccessToken);

export default router;
