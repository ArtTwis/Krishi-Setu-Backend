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
  changePasswordUserRequestSchema,
  loginUserRequestSchema,
  logoutUserRequestSchema,
  registerUserRequestSchema,
  verifyUserRequestSchema,
} from "./validationSchemas/userAuth.validation.js";
import { validateRequest } from "../utils/validate.util.js";
import { attachRole } from "../middlewares/attachRole.middleware.js";
import { UserTypeEnum } from "../constants/common.js";
import { isAdmin, verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users in the system
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router
  .route("/user/register")
  .post(
    validateRequest(registerUserRequestSchema),
    verifyJwtToken,
    isAdmin,
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

router
  .route("/user/change-password")
  .put(
    validateRequest(changePasswordUserRequestSchema),
    attachRole(UserTypeEnum.user),
    verifyJwtToken,
    changePassword
  );

export default router;
