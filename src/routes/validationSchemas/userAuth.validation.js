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
    role: Joi.string().valid("ADMIN", "USER").required(),
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
      .optional(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),
    password: Joi.string().required(),
  }),
};
