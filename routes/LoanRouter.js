const loanController = require('../controller/loanController');
const routeLoan = require("express").Router();


routeLoan.post("/get-id", loanController.getId);
routeLoan.post("/add", loanController.add);
routeLoan.post("/get-list", loanController.getList);
routeLoan.post("/delete", loanController.deleteLoan);
routeLoan.post("/prefill-loan-info", loanController.prefillLoanInfo);
routeLoan.post("/update", loanController.update);


module.exports = routeLoan;
