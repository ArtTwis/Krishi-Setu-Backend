import { errorMessages } from "../constants/errorMessage.js";
import ApiError from "../utils/ApiError.js";

// not-found-middleware.js
export const notFoundMiddleware = (req, res, next) => {
  res.status(404).json(
    new ApiError(
      404,
      {
        requestedUrl: `${req.protocol}://${req.host}${req.originalUrl}`,
        message: errorMessages.invalidRoute,
      },
      errorMessages.invalidRoute
    )
  );
  next();
};
