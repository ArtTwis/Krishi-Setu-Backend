import jwt from "jsonwebtoken";
import { errorMessages } from "../constants/errorMessage.js";
import ApiError from "./apiError.util.js";
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
      return res
        .status(statusCodes.error.unauthorized)
        .json(
          new ApiError(
            statusCodes.error.unauthorized,
            errorMessages.unauthorizedRequest
          )
        );
    }

    const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { role } = req.body;

    const Model = role === UserTypeEnum.admin ? AdminAuth : UserAuth;

    const authResponse = await Model.findById(decodedTokenInfo?._id).select(
      "-password -verificationToken"
    );

    if (!authResponse) {
      return res
        .status(statusCodes.error.notFound)
        .json(
          new ApiError(statusCodes.error.notFound, errorMessages.userNotFound)
        );
    }

    if (!authResponse.refreshToken) {
      return res
        .status(statusCodes.error.unauthorized)
        .json(
          new ApiError(
            statusCodes.error.unauthorized,
            errorMessages.unauthorizedRequest
          )
        );
    }

    req.auth = authResponse;

    next();
  } catch (error) {
    return res
      .status(statusCodes.error.badRequest)
      .json(
        new ApiError(statusCodes.error.badRequest, errorMessages.badRequest)
      );
  }
};
