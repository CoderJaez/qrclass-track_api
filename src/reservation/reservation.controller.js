const mongoose = require("mongoose");
const TryCatch = require("../utils/tryCatch");
const DataAccess = require("../DataAccess");
const Reservation = require("./reservation.model");
const service = require("./reservation.service");
const { FindAll } = require("./reservation.service");
const Occupancy = require("../occupancy/occupancy.model");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    console.log(data);
    let newResevation = new Reservation(data);

    newResevation = await newResevation.save();

    let newData = await service.FindOne({ _id: newResevation._id });
    newData = {
      _id: newData._id,
      event: newData.event,
      dateFrom: newData.dateFrom,
      date_to: newData.dateTo,
      instructor: newData.instructor.fullname,
      classroom: newData.classroom.roomNo,
      status: newData.status,
    };
    if (!newResevation)
      return res.status(500).json({ message: "Error saving reservation" });

    return res.status(200).json({
      message: "Successfully registered a reservation",
      newReservation: newData,
    });
  }),

  get: TryCatch(async (req, res) => {
    const id = req.params.id;
    const filter = req.query ? req.query : {};
    let match = {};
    const pageSize = filter.limit ? filter.limit : 20; // Number of documents per page
    const pageNumber = filter.page ? filter.page : 0; // Page number to retrieve
    const filterDate =
      filter.date_from && filter.date_to
        ? { $gte: new Date(filter.date_from), $lte: new Date(filter.date_to) }
        : null;

    if (filter.search !== undefined && filterDate) {
      match = {
        $or: [
          { "instructor.lastname": { $regex: filter.search, $options: "i" } },
          { "instructor.fistname": { $regex: filter.search, $options: "i" } },
        ],
        dateFrom: filterDate,
      };
    } else if (filterDate) {
      match = {
        dateFrom: filterDate,
      };
    } else if (mongoose.isValidObjectId(filter.search)) {
      match = {
        "instructor._id": new mongoose.Types.ObjectId(filter.search),
      };
    } else {
      match = {
        $or: [
          { "instructor.lastname": { $regex: filter.search, $options: "i" } },
          { "instructor.fistname": { $regex: filter.search, $options: "i" } },
        ],
      };
    }
    const result = await service.FindAll(match);
    if (!result)
      return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json(result);
  }),

  getOne: TryCatch(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid Object Id" });

    const match = { _id: new mongoose.Types.ObjectId(id) };
    const result = await service.FindAll(match);
    if (!result)
      return res.status(500).json({ message: "Error retrieving data" });

    return res.status(200).json(result[0]);
  }),
  put: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    delete data._id;

    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid Object Id" });
    const result = await Reservation.updateOne({ _id: id }, data);
    if (!result || !result.acknowledged)
      return res.status(500).json({ message: "Error updating reservation" });

    return res
      .status(200)
      .json({ message: "Successfully updated reservation" });
  }),

  remove: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid Object Id" });

    const result = await Reservation.findByIdAndDelete(id);
    if (!result)
      return res.status(500).json({ message: "Error deleting reservation" });

    return res
      .status(200)
      .json({ message: "Successfully deleted reservation" });
  }),

  setReservationStatus: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid object Id" });

    const result = await Reservation.updateOne({ _id: id }, data);
    if (!result | !result.acknowledged)
      return res
        .status(500)
        .json({ message: "Error updating reservation status" });

    return res
      .status(200)
      .json({ message: `Successfully ${data.status} the reservation.` });
  }),

  occupyReservedRoom: TryCatch(async (req, res) => {
    const data = req.body;
    const occupiedRoom = await Occupancy.countDocuments({
      instructor: data.instructor,
      isVacant: false,
    });
    if (occupiedRoom > 0)
      return res
        .status(403)
        .json({ message: "Your still occupied from the other room." });
    const occupyRoomResult = await Occupancy.create({
      instructor: data.instructor,
      classroom: data.classroom,
    });
    if (!occupyRoomResult)
      return res.status(500).json({ message: "Failed to occupy the room" });
    const updateReserveStatus = await Reservation.updateOne(
      { _id: data.reservationId },
      { status: "occupied" },
    );
    if (!updateReserveStatus)
      return res.status(500).json({ message: "Failed to occupy the room" });

    return res
      .status(200)
      .json({ message: "Successfully occupied the reserved room." });
  }),
};
