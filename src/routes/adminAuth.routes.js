import { Router } from "express";
import {
  loginAdmin,
  registerAdmin,
  verifyAdmin,
} from "../controllers/adminAuth.controller.js";
import {
  loginAdminRequestSchema,
  registerAdminRequestSchema,
  verifyAdminRequestSchema,
} from "./validationSchemas/adminAuth.validation.js";
import { validateRequest } from "../utils/Validate.js";

const router = Router();

router
  .route("/admin/register")
  .post(validateRequest(registerAdminRequestSchema), registerAdmin);

router
  .route("/admin/verify/:token")
  .get(validateRequest(verifyAdminRequestSchema), verifyAdmin);

router
  .route("/admin/login")
  .post(validateRequest(loginAdminRequestSchema), loginAdmin);

export default router;
