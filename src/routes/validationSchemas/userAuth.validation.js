import Joi from "joi";
import { UserTypeEnum } from "../../constants/common.js";

export const registerUserRequestSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com"] },
      })
      .required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    adminId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Invalid admin id. Check and try again."),
  }),
};

export const verifyUserRequestSchema = {
  params: Joi.object({
    token: Joi.string().required(),
  }),
};

export const loginUserRequestSchema = {
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
