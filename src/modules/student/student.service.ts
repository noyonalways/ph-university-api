import { IStudent } from "./student.interface";
import Student from "./student.model";

const getAll = () => {
  return Student.find({}).select("-password");
};

const findByProperty = (
  key: string,
  value: string,
): Promise<IStudent | null> => {
  if (key === "_id") {
    return Student.findById(value);
  } else {
    return Student.findOne({ [key]: value });
  }
};

const deleteSingle = (id: string) => {
  return Student.updateOne({ id }, { isDeleted: true });
};

export default { getAll, findByProperty, deleteSingle };
