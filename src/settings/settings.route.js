const {
  getCourse,
  getProgram,
  getSchoolYear,
  postCourse,
  postProgram,
  postSchoolYear,
  putCourse,
  putProgram,
  putSchoolYear,
  deleteCourse,
  deleteProgram,
  deleteSchoolYear,
  updateActiveSY,
} = require("./settings.controller");
const { Router } = require("express");
const router = Router();

router
  .get("/courses", getCourse)
  .get("/courses/:id", getCourse)
  .get("/programs", getProgram)
  .get("/programs/:id", getProgram)
  .get("/school-year", getSchoolYear)
  .get("/school-year/:id", getSchoolYear)
  .post("/courses", postCourse)
  .post("/programs", postProgram)
  .post("/school-year", postSchoolYear)
  .put("/courses/:id", putCourse)
  .put("/programs/:id", putProgram)
  .put("/school-year/:id", putSchoolYear)
  .put("/school-year/active-sy/:id", updateActiveSY)
  .delete("/courses/:id", deleteCourse)
  .delete("/programs/:id", deleteProgram)
  .delete("/school-year/:id", deleteSchoolYear);

module.exports = router;
