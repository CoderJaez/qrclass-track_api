const mongoose = require("mongoose");
const TryCatch = require("../utils/tryCatch");
const Schedule = require("./schedule.model");
const scheduleController = {
  post: TryCatch(async (req, res) => {
    const { day, course, classroom, time_from, time_to } = req.body;

    let newData = new Schedule(req.body);
    newData = await newData.save();
    if (!newData)
      return res.status(400).json({ message: "Failed to save schedule. " });

    const newSched = await Schedule.findOne({ _id: newData._id })
      .populate("classroom")
      .populate("course")
      .populate("program");
    return res
      .status(201)
      .json({ message: "Successfully created schedule,", schedule: newSched });
  }),
  get: TryCatch(async (req, res) => {
    const schedules = await Schedule.find()
      .populate("classroom")
      .populate("course")
      .populate("program");
    if (!schedules) return res.status(500).json([]);
    return res.status(200).json(schedules);
  }),
  put: TryCatch(async (req, res) => {
    const { day, course, classroom, time_from, time_to, program } = req.body;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });
    const updatedData = await Schedule.updateOne(
      { _id: id },
      {
        program: program._id,
        course: course._id,
        classroom: classroom._id,
        day: day,
        time_from: time_from,
        time_to: time_to,
      }
    );

    if (!updatedData)
      return res.status(400).json({ message: "Failed to update schedule" });
    return res.status(200).json({ message: "Successfully updated schedule" });
  }),
  remove: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });

    const deleteCourse = await Schedule.findByIdAndDelete(id);
    if (!deleteCourse)
      return res.status(400).json({ message: "Error deleting schedule" });
    return res.status(200).json({ message: "Success deleting schedule." });
  }),
};

module.exports = scheduleController;
