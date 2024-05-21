const TryCatch = require("../utils/tryCatch");
const { Program, Course, SchoolYear } = require("./settings.model");
const mongoose = require("mongoose");
module.exports = {
  postSchoolYear: TryCatch(async (req, res) => {
    const data = req.body;
    let newSchoolYear = new SchoolYear(data);
    newSchoolYear = await newSchoolYear.save();

    if (newSchoolYear)
      return res
        .status(200)
        .json({ message: "New School Year successfully created." });
    return res.status(500).json({ message: "Something went wrong." });
  }),

  getSchoolYear: TryCatch(async (req, res) => {
    const id = req.params.id;

    let schoolYear;
    if (mongoose.isValidObjectId(id))
      schoolYear = await SchoolYear.findOne({ _id: id });
    else schoolYear = await SchoolYear.find();

    return res.status(200).json(schoolYear);
  }),
  updateActiveSY: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid paramaters." });
    const inactiveAllSY = await SchoolYear.updateMany(
      {},
      { $set: { active: false } }
    );
    const setActiveSY = await SchoolYear.findByIdAndUpdate(id, {
      active: true,
    });
    if (!setActiveSY)
      return res
        .status(400)
        .json({ message: "Cannot set to active shool year. " });

    return res
      .status(200)
      .json({ message: "Selected school year is now active. " });
  }),
  putSchoolYear: TryCatch(async (req, res) => {
    const { sy, sem } = req.body;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });
    const updatedSchoolYear = await SchoolYear.updateOne(
      { _id: id },
      { sy: sy, sem: sem }
    );
    if (!updatedSchoolYear)
      return res.status(400).json({ message: "Error updating school year" });

    return res
      .status(200)
      .json({ message: "Successfully updating school year." });
  }),
  deleteSchoolYear: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });

    const deletedSchoolYear = await SchoolYear.findByIdAndDelete(id);
    if (!deletedSchoolYear)
      return res.status(400).json({ message: "Error deleting school year" });

    return res
      .status(200)
      .json({ message: "Successfully deleting school year" });
  }),

  postProgram: TryCatch(async (req, res) => {
   // const { code, sem, program, description } = req.body;
    const data = req.body
    let newProgram = new Program(data);
    newProgram = await newProgram.save();

    if (!newProgram)
      return res.status(500).json({ message: "Error saving program" });

    return res
      .status(201)
      .json({ program: newProgram, message: "Successfully creating program" });
  }),
  getProgram: TryCatch(async (req, res) => {
    const id = req.params.id;
    const { search } = req.query;
    let program;

    if (mongoose.isValidObjectId(id))
      program = await Program.findOne({ _id: id }).populate("courses");
    else
      program = await Program.find(
        search
          ? {
              $or: [{ name: { $regex: search, $options: "i" } }],
            }
          : {}
      ).populate("courses");

    return res.status(200).json(program);
  }),
  putProgram: TryCatch(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });
    const updateProgram = await Program.updateOne({ _id: id }, data);
    if (!updateProgram)
      return res.status(400).json({ message: "Error updating program" });
    return res.status(200).json({ message: "Successfully updating program" });
  }),
  deleteProgram: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id." });

    const deleteProgram = await Program.findByIdAndDelete(id);
    if (!deleteProgram)
      return res.status(400).json({ message: "Error deleting program" });
    return res.status(200).json({ message: "Successfully deleting program" });
  }),
  postCourse: TryCatch(async (req, res) => {
    const data = req.body;
    let newCourse = new Course(data);
    newCourse = await newCourse.save();

    const addCourse = await Program.updateOne(
      { _id: data.program },
      { $push: { courses: newCourse._id } }
    );

    if (!newCourse)
      return res.status(400).json({ message: "Error saving course" });
    return res
      .status(200)
      .json({ message: "Successfully saving course.", course: newCourse });
  }),
  getCourse: TryCatch(async (req, res) => {
    const { search } = req.query;
    const id = req.params.id;
    let course;
    if (mongoose.isValidObjectId(id))
      course = await Course.findOne({ _id: id });
    else
      course = await Course.find(
        search ? { $or: { name: { $regex: search, $options: "i" } } } : {}
      ).populate("program");

    return res.status(200).json(course);
  }),
  putCourse: TryCatch(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });
    const updateCourse = await Course.updateOne({ _id: id }, data);
    if (!updateCourse)
      return res.status(400).json({ message: "Error updating course" });
    return res.status(200).json({ message: "Successfully updating course" });
  }),
  deleteCourse: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object id" });

    const deleteCourse = await Course.findByIdAndDelete(id);
    if (!deleteCourse)
      return res.status(400).json({ message: "Error deleting course" });

    return res.status(200).json({ message: "Success deleting course." });
  }),
};
