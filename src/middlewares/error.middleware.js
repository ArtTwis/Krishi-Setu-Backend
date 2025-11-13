import ApiError from "../utils/apiError.util.js";
import { statusCodes } from "../constants/statusCodes.js";
import { errorMessages } from "../constants/errorMessage.js";

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      statusCodes.serverError.internalServerError,
      errorMessages.internalServerError,
      error?.errors || []
    );
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  console.error(`${error.message}`);

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
