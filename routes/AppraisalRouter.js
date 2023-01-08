const appraisalController = require('../controller/appraisalController');
const routeAppraisal = require("express").Router();


routeAppraisal.post("/get-id", appraisalController.getId);
routeAppraisal.post("/add", appraisalController.add);
routeAppraisal.post("/get-list", appraisalController.getList);
routeAppraisal.post("/delete", appraisalController.deleteAppraisal);
routeAppraisal.post("/prefill-appraisal-info", appraisalController.prefillAppraisalInfo);
// routeAppraisal.post("/get-holiday", appraisalController.getHoliday);
// routeAppraisal.post("/update", appraisalController.update);


module.exports = routeAppraisal;
