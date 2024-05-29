import {
  TAacademicSemesterNameCodeMapper,
  TAcademicSemesterCodes,
  TAcademicSemesterNames,
  TMonths,
} from "./academicSemester.interface";

export const Months: TMonths[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const AcademicSemesterNames: TAcademicSemesterNames[] = [
  "Autumn",
  "Summer",
  "Fall",
];

export const AcademicSemesterCodes: TAcademicSemesterCodes[] = [
  "01",
  "02",
  "03",
];

export const academicSemesterNameCodeMapper: TAacademicSemesterNameCodeMapper =
  {
    Autumn: "01",
    Summer: "02",
    Fall: "03",
  };
