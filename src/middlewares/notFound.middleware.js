import { errorMessages } from "../constants/errorMessage.js";
import { statusCodes } from "../constants/statusCodes.js";
import ApiError from "../utils/apiError.util.js";

// not-found-middleware.js
export const notFoundMiddleware = (req, res, next) => {
  res.status(404).json(
    new ApiError(
      statusCodes.error.notFound,
      {
        requestedUrl: `${req.protocol}://${req.host}${req.originalUrl}`,
        message: errorMessages.invalidRoute,
      },
      errorMessages.invalidRoute
    )
  );
  next();
};
