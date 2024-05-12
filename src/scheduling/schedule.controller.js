const mongoose = require("mongoose");
const TryCatch = require("../utils/tryCatch");
const Schedule = require("./schedule.model");
const scheduleController = {
  post: TryCatch(async (req, res) => {
    const data = req.body;

    const newData = new Schedule(data);
    if (!newData)
      return res.status(400).json({ message: "Failed to save schedule. " });
  }),
  get: TryCatch(async (req, res) => {}),
  put: TryCatch(async (req, res) => {}),
  delete: TryCatch(async (req, res) => {}),
};

module.exports = scheduleController;
