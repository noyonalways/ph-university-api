import { Error } from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

interface MongooseDuplicateKeyError extends Error {
  code: number;
  keyPattern: Record<string, unknown>;
  keyValue: Record<string, unknown>;
}

const handleDuplicateIdError = (
  err: MongooseDuplicateKeyError,
): TGenericErrorResponse => {
  const match = err?.message?.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const statusCode = 400;
  const errorSources: TErrorSources = [
    {
      path: Object.keys(err?.keyPattern).toString(),
      message: `${extractedMessage} is already exists`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate Id",
    errorSources,
  };
};

export default handleDuplicateIdError;
