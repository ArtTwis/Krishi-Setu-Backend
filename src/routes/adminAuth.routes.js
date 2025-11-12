import { Router } from "express";
import {
  loginAccount,
  registerAccount,
  verifyAccount,
  logoutAccount,
  reGenerateAccessToken,
  changePassword,
} from "../controllers/auth.controller.js";
import {
  loginAdminRequestSchema,
  registerAdminRequestSchema,
  verifyAdminRequestSchema,
  logoutAdminRequestSchema,
  changePasswordAdminRequestSchema,
} from "./validationSchemas/adminAuth.validation.js";
import { validateRequest } from "../utils/validate.util.js";
import { attachRole } from "../middlewares/attachRole.middleware.js";
import { UserTypeEnum } from "../constants/common.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/admin/register")
  .post(
    validateRequest(registerAdminRequestSchema),
    attachRole(UserTypeEnum.admin),
    registerAccount
  );

router
  .route("/admin/verify/:token")
  .get(
    validateRequest(verifyAdminRequestSchema),
    attachRole(UserTypeEnum.admin),
    verifyAccount
  );

router
  .route("/admin/login")
  .post(
    validateRequest(loginAdminRequestSchema),
    attachRole(UserTypeEnum.admin),
    loginAccount
  );

router
  .route("/admin/logout")
  .post(
    validateRequest(logoutAdminRequestSchema),
    attachRole(UserTypeEnum.admin),
    verifyJwtToken,
    logoutAccount
  );

router
  .route("/admin/regenerateToken")
  .post(attachRole(UserTypeEnum.admin), reGenerateAccessToken);

router
  .route("/admin/change-password")
  .put(
    validateRequest(changePasswordAdminRequestSchema),
    attachRole(UserTypeEnum.admin),
    verifyJwtToken,
    changePassword
  );

export default router;
