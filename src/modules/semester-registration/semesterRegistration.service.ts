import QueryBuilder from "../../builder/QueryBuilder";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import SemesterRegistration from "./semesterRegistration.model";

const create = (payload: TSemesterRegistration) => {
  return SemesterRegistration.create(payload);
};

const getAll = (query: Record<string, unknown>) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find(),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  return semesterRegistrationQuery.modelQuery;
};

export default {
  create,
  getAll,
};
