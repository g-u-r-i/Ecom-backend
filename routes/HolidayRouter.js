const holidayController = require('../controller/holidayController');
const routeHoliday = require("express").Router();


routeHoliday.post("/add", holidayController.add);
routeHoliday.post("/delete", holidayController.deleteHoliday);
routeHoliday.post("/prefill-holiday-info", holidayController.prefilledHolidayInfo);
routeHoliday.post("/get-holiday", holidayController.getHoliday);
routeHoliday.post("/update", holidayController.update);


module.exports = routeHoliday;
