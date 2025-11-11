import { errorMessages } from "../constants/errorMessage.js";
import { statusCodes } from "../constants/statusCodes.js";
import ApiError from "./apiError.util.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const validationTargets = ["body", "params", "query"];
    const errors = [];

    for (const target of validationTargets) {
      if (schema[target]) {
        const { error, value } = schema[target].validate(req[target], {
          abortEarly: false, // show all validation errors
          allowUnknown: true, // ignore extra fields
          stripUnknown: true, // remove unknown fields
        });

        if (error) {
          errors.push(...error.details.map((err) => err.message));
        } else {
          req[target] = value; // assign sanitized data back
        }
      }
    }

    if (errors.length) {
      return res
        .status(statusCodes.error.validationError)
        .json(
          new ApiError(
            statusCodes.error.validationError,
            errors,
            errorMessages.invalidFieldValues
          )
        );
    }

    next();
  };
};
