import { isValidObjectId } from "mongoose";
import { customError } from "../../utils";
import Student from "./student.model";

const getAll = () => {
  return Student.find({})
    .select("-password")
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
};

const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw customError(false, 400, "Invalid productId");
    }
    return Student.findById(value);
  } else {
    return Student.findOne({ [key]: value });
  }
};

const deleteSingle = async (id: string) => {
  if (!isValidObjectId(id)) {
    throw customError(false, 400, "Invalid productId");
  }
  const student = await Student.findByIdAndDelete(id);
  if (!student) {
    throw customError(false, 404, "Student not found");
  }
  return null;
};

export default { getAll, findByProperty, deleteSingle };
