import { errorMessages } from "../constants/errorMessage.js";
import { statusCodes } from "../constants/statusCodes.js";
import ApiError from "../utils/apiError.util.js";

// not-found-middleware.js
export const notFoundMiddleware = (req, res, next) => {
  res.status(statusCodes.error.notFound).json(
    new ApiError(statusCodes.error.notFound, errorMessages.invalidRoute, {
      requestedUrl: `${req.protocol}://${req.host}${req.originalUrl}`,
      message: errorMessages.invalidRoute,
    })
  );
  next();
};
