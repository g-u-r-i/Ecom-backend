const leaveController = require('../controller/leaveController');
const routeLeave = require("express").Router();


routeLeave.post("/newleave", leaveController.newLeave);
routeLeave.post("/getmyleaves", leaveController.getMyLeaves);
routeLeave.post("/get-leaves", leaveController.getLeaves);
routeLeave.post("/leavestatus", leaveController.leavesStatus);
routeLeave.post("/deleteleave", leaveController.deleteLeaves);
routeLeave.post("/filterData", leaveController.filterData);


module.exports = routeLeave;
