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

/**
 * @swagger
 * tags:
 *   name: Admin Authentication
 *   description: Endpoints related to Admin authentication and account management
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin account
 *     description: Creates a new admin account after validating the request schema.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully. Please verify your email.
 *       400:
 *         description: Validation error
 *       409:
 *         description: Admin already exists
 */

/**
 * @swagger
 * /admin/verify/{token}:
 *   get:
 *     summary: Verify admin account
 *     description: Verifies admin account using the token received via email.
 *     tags: [Admin Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent via email
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified successfully.
 *       400:
 *         description: Invalid or expired verification token
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticates an admin and returns access and refresh tokens.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Admin logout
 *     description: Invalidates access and refresh tokens.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/regenerateToken:
 *   post:
 *     summary: Regenerate access token
 *     description: Generates a new access token using the refresh token.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access token regenerated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /admin/change-password:
 *   put:
 *     summary: Change admin password
 *     description: Allows admin to change password using the old password.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: Admin@123
 *               newPassword:
 *                 type: string
 *                 example: Admin@456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

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
