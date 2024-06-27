import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import httpStatus from "http-status";
import config from "../config";
import AppError from "../errors/AppError";

// Configuration
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const sendImageToCloudinary = async (imageName: string, path: string) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });

    // delete a file asynchronously
    fs.unlink(path, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } else {
        // eslint-disable-next-line no-console
        console.log("File is deleted.");
      }
    });

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("upload-error", error);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Missing required parameter - file",
    );
  }
};

export default sendImageToCloudinary;
