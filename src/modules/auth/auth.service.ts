import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import User from "../user/user.model";
import { TLoginUser } from "./auth.interface";

// login
const login = async (payload: TLoginUser) => {
  // check the user is exist
  // const user = await findByProperty("id", payload.id);
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted");
  }

  // check the is user status
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  // check the password is correct
  // const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!(await User.isPasswordMatched(payload.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect credentials");
  }

  // generate jwt token
  const jwtPayload: Record<string, unknown> = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  return {
    accessToken,
    needsPassword: user?.needsPasswordChange,
  };
};

// find single
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
    }
    return User.findById(value);
  } else {
    return User.findOne({ [key]: value });
  }
};

export default {
  login,
  findByProperty,
};
