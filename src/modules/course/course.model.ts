import { Schema, model } from "mongoose";
import { TCourse, TPreRequisiteCourses } from "./course.interface";

const preRequisiteCourses = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: [true, "title is required"],
    trim: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: [true, "prefix is required"],
    trim: true,
    uppercase: true,
  },
  code: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: [true, "credits is required"],
    min: 1,
    max: 3,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  preRequisiteCourses: {
    type: [preRequisiteCourses],
    _id: false,
  },
});
// TODO: remove the _id: false from 'preRequisiteCourses'

// filter out deleted documents
courseSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

courseSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
courseSchema.pre("findOneAndUpdate", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

courseSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Course = model<TCourse>("Course", courseSchema);
export default Course;
