import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { catchAsync, sendResponse } from "../../utils";
import authService from "./auth.service";

const login = catchAsync(async (req, res) => {
  const { accessToken, needsPasswordChange, refreshToken } =
    await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 60 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: { accessToken, needsPasswordChange },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await authService.changePassword(req.user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: result,
  });
});

// forget password
const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgetPassword(req.body.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent successfully",
    data: result,
  });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    throw new AppError(httpStatus.FORBIDDEN, "Access Forbidden");
  }

  const result = await authService.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

export default {
  login,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
