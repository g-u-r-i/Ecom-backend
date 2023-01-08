// const verify = require("../middleware/verify.js");
// const express = require("express");
// const appraisalRouter = express.Router();
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


const getId = async (req, res) => {
    // appraisalRouter.post("/get-id", async (req, res) => {
    // console.log(req.body.organisationId, "oraganisation");
    const organisationId = decrypt(req.body.organisationId);
    const data = await db.query(
        "SELECT users.user_id,users.name FROM `users` INNER JOIN custom_roles on custom_roles.custom_role_id = users.role_id AND custom_roles.role !='owner'  WHERE  users.organisation_id=" + organisationId + "",
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

const add = async (req, res) => {
    // appraisalRouter.post("/add", async (req, res) => {
    // console.log(req.body, "appraisal");
    const result = db.query("INSERT INTO `salary_appraisal`(`user_id`,`current_Salary`,`appraisal_Date`,`next_Appraisal`,`appraisal_Amount`) VALUES('" +
        req.body.userId +
        "', '" +
        req.body.currentSalary +
        "', '" +
        req.body.appraisalDate.dateYear + "-" + req.body.appraisalDate.dateMonth + "-" + req.body.appraisalDate.dateDate +
        "', '" +
        req.body.nextAppraisalDate.dateYear + "-" + req.body.nextAppraisalDate.dateMonth + "-" + req.body.nextAppraisalDate.dateDate +
        "', '" +
        req.body.appraisalAmount +
        "')", (err, result) => {
            // console.log(result, "result72");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                res.send({
                    status: messages.SUCCESS,
                    data: "appraisal  added successfully"
                });
            }
        });
};




const getList = async (req, res) => {
    // appraisalRouter.post("/get-list", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId);
    const firstPost = req.body.firstPost;
    const listingPerPage = req.body.listingPerPage;
    const data = await db.query(
        "SELECT salary_id, salary_appraisal.user_id,users.name, current_Salary, appraisal_Date, next_Appraisal, appraisal_Amount FROM salary_appraisal INNER JOIN users ON users.user_id=salary_appraisal.user_id WHERE organisation_id = " + organisationId + "  LIMIT " + firstPost + ", " + listingPerPage + "   ",
        (err, appraisalresult) => {
            // console.log(appraisalresult, "result");
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            const totalRecord = db.query("SELECT COUNT(*) as count FROM salary_appraisal INNER JOIN users ON users.user_id=salary_appraisal.user_id WHERE organisation_id=" + organisationId + "", (err, result) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
                res.send({
                    status: messages.SUCCESS,
                    data: { appraisalresult: appraisalresult, result: result }
                });
            });
        });
};


const deleteAppraisal = async (req, res) => {
    // appraisalRouter.post("/delete", async (req, res) => {
    const result = await db.query(
        "DELETE FROM salary_appraisal WHERE salary_id=?",
        req.body.salaryId,
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

const prefillAppraisalInfo = async (req, res) => {
    // appraisalRouter.post("/prefill-appraisal-info", async (req, res) => {
    const data = await db.query(
        "SELECT * FROM salary_appraisal WHERE salary_id=?",
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

// const getHoliday  = async (req, res) => {
// // appraisalRouter.post("/get-holiday", async (req, res) => {
//     const organisation = decrypt(req.body.organisation_id);
//     const year = req.body.year;
//     // console.log(year, "yera");
//     const result = db.query("SELECT * FROM holidays WHERE organisation_id=? AND holiday_Date LIKE '" + year + "%' ",
//         organisation,
//         (err, result) => {
//             // console.log(result, "result");
//             if (err) {
//                 res.send({
//                     status: messages.ERROR,
//                     error: err,
//                 });
//             }
//             res.send({
//                 status: messages.SUCCESS,
//                 data: result
//             });
//         });
// };

// const update = async (req, res) => {
// // appraisalRouter.post("/update", async (req, res) => {
//     console.log(req.body.date, "dateUpdate");
//     const result = await db.query(
//         "UPDATE holidays SET `holiday_Name` = '" +
//         req.body.holidayname +
//         "' , `holiday_Date` = '" +
//         req.body.date.dateYear + "-" + req.body.date.dateMonth + "-" + req.body.date.dateDate +
//         "' WHERE holiday_id =?",
//         req.body.id,
//         (err, result) => {
//             console.log(err, "err");
//             if (err) {
//                 res.send({
//                     status: messages.ERROR,
//                     error: err,
//                 });
//             }
//             console.log(result, "result");
//             res.send({
//                 status: messages.SUCCESS,
//                 data: "Data saved successfully",
//             });
//         }
//     );
// };

module.exports = {
    getId,
    add,
    getList,
    deleteAppraisal,
    prefillAppraisalInfo,
    // getHoliday,
    // update

};



