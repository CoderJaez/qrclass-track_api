const mongoose = require("mongoose");
const TryCatch = require("../utils/tryCatch");
const Reservation = require('../reservation/reservation.model')
const Classroom = require('../classrooom/classroom.model')
const Occupancy = require('../occupancy/occupancy.model')
const Instructor = require('../instructor/instructor.model')

const instructors  = async() => {
    return await Instructor.countDocuments();
}

const rooms = async () => {
    const room = Classroom.findAll();

}

module.exports = {
    getSumarries: TryCatch(async(req,res) => {

    })
}