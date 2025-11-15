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
 * tags:
 *   name: User Authentication
 *   description: Endpoints related to User authentication and account management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a new user account. Only admins can register users.
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: User@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully. Please verify your email.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (only admin can register users)
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /user/verify/{token}:
 *   get:
 *     summary: Verify user account
 *     description: Verifies a user's account using the token sent via email.
 *     tags: [User Authentication]
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
 * /user/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns access and refresh tokens.
 *     tags: [User Authentication]
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: User@123
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
 * /user/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user and invalidates access and refresh tokens.
 *     tags: [User Authentication]
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
 *         description: Unauthorized (invalid token)
 */

/**
 * @swagger
 * /user/regenerateToken:
 *   post:
 *     summary: Regenerate user access token
 *     description: Generates a new access token using the refresh token.
 *     tags: [User Authentication]
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
 * /user/change-password:
 *   put:
 *     summary: Change user password
 *     description: Allows a logged-in user to change their password using the old one.
 *     tags: [User Authentication]
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
 *                 example: User@123
 *               newPassword:
 *                 type: string
 *                 example: User@456
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
