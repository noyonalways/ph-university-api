import { TStatus } from "./semesterRegistration.interface";

export const SemesterRegistrationStatus: TStatus[] = [
  "UPCOMING",
  "ONGOING",
  "ENDED",
];

export const RegistrationStatus = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  ENDED: "ENDED",
} as const;
