import Joi from "joi";

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

export const logoutUserRequestSchema = {
  body: Joi.object({}),
};

export const changePasswordUserRequestSchema = {
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
