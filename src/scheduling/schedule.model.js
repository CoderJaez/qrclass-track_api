const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: [true, "{PATH} is required."],
    },
    program: {
      type: mongoose.Types.ObjectId,
      ref: "Program",
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

scheduleSchema.pre("validate", async function (next) {
  try {
    const time_from = new Date(`01/01/01 ${this.time_from}`);
    const time_to = new Date(`01/01/01 ${this.time_to}`);
    const existingSchedule = await this.constructor.find({
      day: this.day,
      classroom: this.classroom,
      _id: { $ne: this._id }, // Exclude the current document from the check if it's an update
    });
    if (time_to <= time_from)
      this.invalidate("time_to", "Invalid time schedule.");

    for (const sched of existingSchedule) {
      const exist_time_to = new Date(`01/01/01 ${sched.time_to}`);
      const exist_time_from = new Date(`01/01/01 ${sched.time_from}`);
      if (exist_time_to > time_from && exist_time_to < time_to) {
        this.invalidate("time_to", "Time conflict with an existing schedule.");
        break;
      } else if (exist_time_from > time_to && exist_time_from < time_from) {
        this.invalidate(
          "time_from",
          "Time conflict with an existing schedule."
        );
        break;
      } else if (exist_time_from <= time_from && exist_time_to >= time_to) {
        this.invalidate("day", "Time conflict with an existing schedule.");
        break;
      }
    }
    if (!existingSchedule) return next();
  } catch (error) {
    next(error);
  }
});

const syProgSchedSchema = mongoose.Schema({});
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
