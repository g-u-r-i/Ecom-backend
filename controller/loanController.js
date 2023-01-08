const db = require("../config/dbConnection");
const messages = require("../consts.js");
var permission = require('../Permission/Permission.json')
const jwt = require("jsonwebtoken");
const jwtExpirySeconds = 6000;
const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";

// const verify = require("../middleware/verify.js");
// const express = require("express");
// const loanRouter = express.Router();
// const app = express();
// const jwt = require("jsonwebtoken");
// const jwtExpirySeconds = 6000;
// const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";
// const messages = require("../consts.js");
// const db = require("../connection/db.js");
// const bodyParser = require('body-parser')
// require('dotenv').config();
// app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(express.json());

const multer = require('multer');
const path = require('path');
const { decrypt } = require("../UtilFunctions/utilFunctions.js");
const uuid = require('uuid').v4;
const DIR = '../Assets/';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        const filePath = uuid() + '-' + fileName;
        cb(null, filePath);

    }
});



const getId = async (req, res) => {
    // loanRouter.post("/get-id", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId);
    const data = await db.query(
        "SELECT users.name,users.user_id,custom_roles.role FROM `users`INNER JOIN custom_roles ON custom_roles.custom_role_id=users.role_id WHERE custom_roles.role!='owner' AND users.organisation_id=" + organisationId + "",
        (err, result) => {
            // console.log(result, "result40");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                res.send({
                    status: messages.SUCCESS,
                    data: result,
                });
            }
        });
};


const add = async (req, res) => {
    // loanRouter.post("/add", async (req, res) => {
    // console.log("LOLL : ", req.body);
    const organisationId = decrypt(req.body.organisationId);

    // console.log("PP: ", "INSERT INTO `loan`(`user_id`,`amount`,`date`,`type`,`organisation_id`) VALUES('" +
    // req.body.userId +
    // "', '" +
    // req.body.amount +
    // "', '" +
    // req.body.loandate.dateYear + "-" + req.body.loandate.dateMonth + "-" + req.body.loandate.dateDate +
    // "', '" +
    // req.body.type +
    // "', '" +
    // organisationId +
    // "')")
    const result = db.query("INSERT INTO `loan`(`user_id`,`amount`,`date`,`type`,`organisation_id`) VALUES('" +
        req.body.userId +
        "', '" +
        req.body.amount +
        "', '" +
        req.body.loandate.dateYear + "-" + req.body.loandate.dateMonth + "-" + req.body.loandate.dateDate +
        "', '" +
        req.body.type +
        "', '" +
        organisationId +
        "')", (err, result) => {
            console.log(  "result  : ", result);
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                res.send({
                    status: messages.SUCCESS,
                    data: "loan added successfully"
                });
            }
        });
};


const getList = async (req, res) => {
    // loanRouter.post("/get-list", async (req, res) => {
    // console.log(req.body,"req.body105");
    const organisationId = decrypt(req.body.organisationId);
    const firstPost = req.body.firstPost;
    const listingPerPage = req.body.listingPerPage;

    const data = await db.query(
        "SELECT users.name,loan.date,loan.loan_id,loan.amount,loan.type from users INNER JOIN loan ON loan.user_id=users.user_id WHERE users.organisation_id = " + organisationId + "  LIMIT " + firstPost + ", " + listingPerPage + "   ",
        (err, loanresult) => {
            // console.log(loanresult, "result");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            const totalRecord = db.query("SELECT COUNT(*) as count FROM loan INNER JOIN users ON users.user_id=loan.user_id WHERE users.organisation_id=" + organisationId + "", (err, result) => {
                // console.log(result,"resultss");
                if (err) {

                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
                res.send({
                    status: messages.SUCCESS,
                    data: { loanresult: loanresult, result: result }
                });
            });
        }
    );
};



const deleteLoan = async (req, res) => {
    // loanRouter.post("/delete", async (req, res) => {
    const result = await db.query(
        "DELETE FROM loan WHERE loan_id=?",
        req.body.loanId,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            res.send({
                status: messages.SUCCESS,
                data: "data deleted successfully",
            });
        });
};


const prefillLoanInfo = async (req, res) => {
    // loanRouter.post("/prefill-loan-info", async (req, res) => {
    const data = await db.query(
        "SELECT * FROM loan WHERE loan_id=?",
        req.body.id,
        (err, result) => {
            // console.log(result, "result");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                res.send({
                    status: messages.SUCCESS,
                    data: result,
                });
            }
        });
};


const update = async (req, res) => {
    // loanRouter.post("/update", async (req, res) => {
    // console.log(req.body.date, "dateUpdate");
    const result = await db.query(
        "UPDATE loan SET `amount` = '" +
        req.body.amount +
        "' , `type` = '" +
        req.body.type +
        "' , `date` = '" +
        req.body.loandate.dateYear + "-" + req.body.loandate.dateMonth + "-" + req.body.loandate.dateDate +
        "' WHERE loan_id =?",
        req.body.id,
        (err, result) => {
            // console.log(err, "err");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            // console.log(result, "result");
            res.send({
                status: messages.SUCCESS,
                data: "Data saved successfully",
            });
        });
};

module.exports = {
    getId,
    add,
    getList,
    deleteLoan,
    prefillLoanInfo,
    update

};
