const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: [true, "{PATH} is required."],
    },
    classroom: {
      type: mongoose.Types.ObjectId,
      ref: "Classroom",
      required: [true, "{PATH} is required."],
    },
    day: {
      type: String,
      required: [true, "{PATH} is required."],
    },
    time_from: {
      type: String,
      required: [true, "{PATH} is required."],
    },
    time_to: {
      type: String,
      required: [true, "{PATH} is required"],
    },
    conflict: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

scheduleSchema.pre("save", async function (next) {
  try {
    const existingSchedule = await this.constructor.findOne({
      day: this.day,
      sy: this.sy,
      classroom: this.classroom,
      $or: [
        {
          time_from: { $lte: this.time_from },
          time_to: { $gte: this.time_from },
        },
        {
          time_from: { $lte: this.time_to },
          time_to: { $gte: this.time_to },
        },
      ],
      _id: { $ne: this._id }, // Exclude the current document from the check if it's an update
    });

    if (existingSchedule) {
      this.invalidate("Time conflict with an existing schedule.");
    }

    next();
  } catch (error) {
    next(error);
  }
});

const syProgSchedSchema = mongoose.Schema({});
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
