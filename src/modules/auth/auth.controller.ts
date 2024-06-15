import httpStatus from "http-status";
import config from "../../config";
import { catchAsync, sendResponse } from "../../utils";
import authService from "./auth.service";

const login = catchAsync(async (req, res) => {
  const { accessToken, needsPasswordChange, refreshToken } =
    await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
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

export default {
  login,
  changePassword,
};
