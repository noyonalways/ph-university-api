import { TCustomError } from "../types";
export function customError(
  status: number = 500,
  message: string = "something went wrong",
) {
  const err: TCustomError = new Error(message);
  err.status = status;
  return err;
}
