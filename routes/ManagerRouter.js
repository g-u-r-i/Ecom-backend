const managerController = require('../controller/managerController');
const routeManager = require("express").Router();

routeManager.post("/add", managerController.add);


module.exports = routeManager;
