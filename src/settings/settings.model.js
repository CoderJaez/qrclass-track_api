const mongoose = require("mongoose");

const schoolYearSchema = mongoose.Schema(
  {
    sy: {
      type: String,
      required: [true, "{PATH}  is required"],
    },
    sem: {
      type: String,
      required: [true, "{PATH}  is required"],
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const programSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "{PATH} is required"],
    },
    description: {
      type: String,
      required: [true, "{PATH} is required"],
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const courseSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "{PATH} is required"],
    },
    description: {
      type: String,
      required: [true, "{PATH} is required"],
    },
    sem: { type: String, required: [true, "{PATH} is required"] },
    program: {
      type: mongoose.Types.ObjectId,
      ref: "Program",
      required: [true, "{PATH} is required"],
    },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);
const SchoolYear = mongoose.model("SchoolYear", schoolYearSchema);
const Course = mongoose.model("Course", courseSchema);

module.exports = { Program, SchoolYear, Course };
