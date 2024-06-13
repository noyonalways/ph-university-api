import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/user/user.interface";
import { catchAsync } from "../utils";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    jwt.verify(
      token.split(" ")[1],
      config.jwt_access_secret as string,
      (err, decoded) => {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
        }

        const role = (decoded as JwtPayload).role;
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(httpStatus.FORBIDDEN, "Forbidden Access");
        }
        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};

export default auth;
