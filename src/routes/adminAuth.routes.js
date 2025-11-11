import { Router } from "express";
import {
  loginAccount,
  registerAccount,
  verifyAccount,
} from "../controllers/signUp.controller.js";
import {
  loginAdminRequestSchema,
  registerAdminRequestSchema,
  verifyAdminRequestSchema,
} from "./validationSchemas/adminAuth.validation.js";
import { validateRequest } from "../utils/validate.util.js";
import { attachRole } from "../middlewares/attachRole.middleware.js";
import { UserTypeEnum } from "../constants/common.js";

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

export default router;
