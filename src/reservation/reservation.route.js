const { Router } = require("express");
const {
  get,
  post,
  getOne,
  put,
  remove,
  setReservationStatus,
} = require("./reservation.controller");

const router = Router();
router
  .post("/", post)
  .get("/", get)
  .get("/:id", getOne)
  .put("/:id", put)
  .delete("/:id", remove)
  .put("/update-status/:id", setReservationStatus);

module.exports = router;
