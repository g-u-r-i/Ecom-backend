const attendanceController = require('../controller/attendanceController');
const routeAttendance = require("express").Router();


routeAttendance.post("/attendance", attendanceController.attendance);
routeAttendance.post("/get-attendance", attendanceController.getAttendance);


module.exports = routeAttendance;
