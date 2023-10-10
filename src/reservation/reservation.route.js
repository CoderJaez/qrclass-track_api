const { Router } = require("express");
const { get, post, getOne, put, remove } = require("./reservation.controller");

const router = Router();
router
  .post("/", post)
  .get("/", get)
  .get("/:id", getOne)
  .put("/:id", put)
  .delete("/:id", remove);

module.exports = router;
