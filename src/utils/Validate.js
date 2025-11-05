import { errorMessages } from "../constants/errorMessage.js";
import { statusCodes } from "../constants/statusCodes.js";
import ApiError from "./ApiError";

export const validate = (schema, validationTargets) => (req, res, next) => {
  try {
    const dataToValidate = req[validationTargets];

    const { error } = schema.validate(dataToValidate, {
      abortEarly: false, // show all errors
      allowUnknown: false, // disallow extra fields
      stripUnknown: true, // remove unknown fields
    });

    if (error) {
      return res.status(statusCodes.error.validationError).json(
        new ApiError(
          statusCodes.error.validationError,
          error.details.map((err) => ({
            message: err.message,
            path: err.path.join("."),
          })),
          "Validation failed : " + error.message
        )
      );
    }

    next();
  } catch (err) {
    console.error("Validation Middleware Error:", err);
    res
      .status(500)
      .json({ success: false, message: errorMessages.invalidFieldValues });
  }
};
