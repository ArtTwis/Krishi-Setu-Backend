import Joi from "joi";

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
