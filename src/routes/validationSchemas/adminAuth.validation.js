import Joi from "joi";
import { UserTypeEnum } from "../../constants/common.js";

export const registerAdminRequestSchema = {
  body: Joi.object({
    businessName: Joi.string().min(3).max(50).required(),
    businessOwner: Joi.string().min(3).max(50).required(),
    businessAddress: Joi.string().min(3).max(500).required(),
    about: Joi.string().allow("").optional(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com"] },
      })
      .required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    city: Joi.string().min(3).max(50).required(),
    state: Joi.string().min(3).max(50).required(),
    country: Joi.string().min(3).max(50).required(),
  }),
};

export const verifyAdminRequestSchema = {
  params: Joi.object({
    token: Joi.string().required(),
  }),
};

export const loginAdminRequestSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com"] },
      })
      .required(),
    password: Joi.string().required(),
  }),
};

export const logoutAdminRequestSchema = {
  body: Joi.object({}),
};

export const changePasswordAdminRequestSchema = {
  body: Joi.object({
    oldPassword: Joi.string().min(8).max(50).required().label("Old Password"),
    newPassword: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_\\-])[A-Za-z\\d@$!%*?&#_\\-]{8,50}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "New password must be 8–50 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      })
      .label("New Password"),
  }),
};
