// const verify = require("../middleware/verify.js");
// const express = require("express");
// const holidayRouter = express.Router();
// const app = express();
// const jwt = require("jsonwebtoken");
// const jwtExpirySeconds = 6000;
// const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";

const messages = require("../consts.js");
const db = require("../config/dbConnection");

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


const add = async (req, res) => {
    // holidayRouter.post("/add", async (req, res) => {
    // console.log(req.body.date, "datee");
    const organisation_id = decrypt(`${req.body.organisation_id}`)
    const result = db.query("INSERT INTO `holidays`(`holiday_Name`,`organisation_id`,`holiday_Date`) VALUES('" +
        req.body.holidayname +
        "', '" +
        organisation_id +
        "', '" +
        req.body.date.dateYear + "-" + req.body.date.dateMonth + "-" + req.body.date.dateDate +
        "')", (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                res.send({
                    status: messages.SUCCESS,
                    data: "holidays added successfully"
                });
            }
        });
};


const deleteHoliday = async (req, res) => {
    // holidayRouter.post("/delete", async (req, res) => {
    const holiday_id = req.body.holiday_id;
    const result = await db.query(
        "DELETE FROM holidays WHERE holiday_id=?",
        holiday_id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            res.send({
                status: messages.SUCCESS,
                data: "role deleted successfully",
            });
        });
};


const prefilledHolidayInfo = async (req, res) => {
    // holidayRouter.post("/prefill-holiday-info", async (req, res) => {
    const data = await db.query(
        "SELECT * FROM holidays WHERE holiday_id=?",
        req.body.id,
        (err, result) => {
            // console.log(result, "result");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                if (result.length != 0) {
                    res.send({
                        status: messages.SUCCESS,
                        data: result,
                    });
                }
            }
        });
};


const getHoliday = async (req, res) => {
    // holidayRouter.post("/get-holiday", async (req, res) => {
    const organisation = decrypt(req.body.organisation_id);
    const year = req.body.year;
    // console.log(year, "yera");
    const result = db.query("SELECT * FROM holidays WHERE organisation_id=? AND holiday_Date LIKE '" + year + "%' ",
        organisation,
        (err, result) => {
            // console.log(result, "result");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            res.send({
                status: messages.SUCCESS,
                data: result
            });
        });
};


const update = async (req, res) => {
    // holidayRouter.post("/update", async (req, res) => {
    // console.log(req.body.date, "dateUpdate");
    const result = await db.query(
        "UPDATE holidays SET `holiday_Name` = '" +
        req.body.holidayname +
        "' , `holiday_Date` = '" +
        req.body.date.dateYear + "-" + req.body.date.dateMonth + "-" + req.body.date.dateDate +
        "' WHERE holiday_id =?",
        req.body.id,
        (err, result) => {
            console.log(err, "err");
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
    add,
    deleteHoliday,
    prefilledHolidayInfo,
    getHoliday,
    update

};


