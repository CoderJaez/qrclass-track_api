const mongoose = require("mongoose");
const Classroom = require("../classrooom/classroom.model");
const occupancySchema = mongoose.Schema(
  {
    classroom: {
      type: mongoose.Types.ObjectId,
      ref: "Classroom",
      required: [true, "{PATH} is required"],
      validate: [
        {
          validator: (value) => {
            return mongoose.isValidObjectId(value);
          },
          message: () => "Classroom not found.",
        },
        {
          validator: async (value) => {
            const result = await Classroom.findOne({
              _id: value,
              isOccupied: { $eq: false },
            });
            if (!result) return false;
            return true;
          },
          message: () => "Already occupied by other instructor",
        },
      ],
    },
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "Instructor",
      required: [true, "{PATH} is required"],
      validate: {
        validator: (value) => {
          return mongoose.isValidObjectId(value);
        },
        message: () => "Instructor not found.",
      },
    },
    isVacant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

occupancySchema.pre("validate", async function (next) {
  const instructor = this.instructor;

  const result = await this.constructor.findOne({
    instructor: instructor,
    isVacant: false,
  });
  if (!result) return next();
  this.invalidate(
    "classroom",
    "You still occupied from the other room. Please check. ",
  );
});

const Occupancy = mongoose.model("Occupancy", occupancySchema);
module.exports = Occupancy;
