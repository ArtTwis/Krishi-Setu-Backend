import jwt from "jsonwebtoken";
import { errorMessages } from "../constants/errorMessage.js";
import ApiError from "../utils/apiError.util.js";
import { AdminAuth } from "../models/adminAuth.model.js";
import { UserAuth } from "../models/userAuth.model.js";
import { UserTypeEnum } from "../constants/common.js";
import { statusCodes } from "../constants/statusCodes.js";

export const verifyJwtToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.unauthorizedRequest
      );
    }

    const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { role } = req.body;

    const Model = role === UserTypeEnum.admin ? AdminAuth : UserAuth;

    const authResponse = await Model.findById(decodedTokenInfo?._id).select(
      "-password -verificationToken"
    );

    if (!authResponse) {
      throw new ApiError(
        statusCodes.error.notFound,
        errorMessages.userNotFound
      );
    }

    if (!authResponse?.refreshToken) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.sessionExpired
      );
    }

    req.auth = authResponse;

    next();
  } catch (error) {
    console.log("error : verifyJwtToken :>> ", error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};

/**
 * Restrict access to admin users only
 */
export const isAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");

    const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const authResponse = await AdminAuth.findById(decodedTokenInfo?._id).select(
      "-password -verificationToken"
    );

    if (!authResponse) {
      throw new ApiError(
        statusCodes.error.notFound,
        errorMessages.userNotFound
      );
    }

    if (authResponse.role !== UserTypeEnum.admin) {
      throw new ApiError(
        statusCodes.error.forbidden,
        errorMessages.failedForAdminAccess
      );
    }

    next();
  } catch (error) {
    console.log("error : isAdmin :>> ", error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};
