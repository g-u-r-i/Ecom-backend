const db = require("../config/dbConnection");
const messages = require("../consts.js");


// const verify = require("../middleware/verify.js");
// const express = require("express");
// const pettyRouter = express.Router();
// const app = express();
// const jwt = require("jsonwebtoken");
// const jwtExpirySeconds = 6000;
// const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";
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
    // pettyRouter.post("/add", async (req, res) => {
    const organisationId = decrypt(`${req.body.organisationId}`)
    const userId = decrypt(`${req.body.userId}`)
    let totalAmount;
    let closing_balance = 0;

    const selectedRecord1 = await db.query(
        "SELECT * FROM `petty_cash` WHERE organisation_id='" + organisationId + "' ORDER BY `petty_cash_id` DESC LIMIT 0,1",
        (err, result22) => {
            if (result22.length > 0) {
                closing_balance = result22[0].closing_balance;
            }
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            else {
                if (req.body.transactionType == "credit") {
                    totalAmount = parseInt(closing_balance) + parseInt(req.body.amount)
                }
                else if (req.body.transactionType == "debit") {
                    totalAmount = closing_balance - req.body.amount

                }
                const resultAll = db.query("INSERT INTO `petty_cash`(`amount`,`petty_date`,`description`,`transaction_type`,`user_id`,`organisation_id`,`closing_balance`) VALUES('" +
                    req.body.amount +
                    "', '" +
                    req.body.date.dateYear + "-" + req.body.date.dateMonth + "-" + req.body.date.dateDate +
                    "', '" +
                    req.body.description +
                    "', '" +
                    req.body.transactionType +
                    "', '" +
                    + userId +
                    "', '" +
                    organisationId +
                    "', '" +
                    totalAmount +
                    "')", (err, result2) => {
                        if (err) {
                            res.send({
                                status: messages.ERROR,
                                error: err,
                            });
                        } else {
                            res.send({
                                status: messages.SUCCESS,
                                data: "petty cash management"
                            });
                        }
                    });
            }
        })
};


const prefillPettyInfo = async (req, res) => {
    // pettyRouter.post("/prefill-petty-info", async (req, res) => {
    const organisationId = decrypt(`${req.body.organisationId}`)
    const data = await db.query(
        "SELECT * FROM petty_cash WHERE petty_cash_id=? ",
        req.body.id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            else {
                if (result.length != 0) {
                    res.send({
                        status: messages.SUCCESS,
                        data: result,
                    });

                }
            }
        });
};


const getList = async (req, res) => {
    // pettyRouter.post("/get-list", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId)
    const firstPost = req.body.firstPost;
    const listingPerPage = req.body.listingPerPage;
    let pettyResult;
    const result = await db.query("SELECT * FROM petty_cash WHERE organisation_id=" + organisationId + "  LIMIT " + firstPost + ", " + listingPerPage + "   ", (err, result) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        pettyResult = result;
        const totalRecord = db.query("SELECT COUNT(*) as count FROM petty_cash WHERE organisation_id=" + organisationId + "", (err, result1) => {
            if (err) {

                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            else {
                res.send({
                    status: messages.SUCCESS,
                    data: { pettyResult: pettyResult, result: result1 },
                });
            }
        });
    });
};


const searchDate = async (req, res) => {
    // pettyRouter.post("/search-date", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId)
    const firstPost = req.body.firstPost;
    const listingPerPage = req.body.listingPerPage;
    let pettyResult;
    const result = await db.query("SELECT * FROM petty_cash WHERE organisation_id=" + organisationId + "  LIMIT " + firstPost + ", " + listingPerPage + "   ", (err, result) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        pettyResult = result;
        const totalRecord = db.query("SELECT COUNT(*) as count FROM petty_cash WHERE organisation_id=" + organisationId + " AND  petty_date >= '" + req.body.dateAll.dateYear + "-" + (req.body.dateAll.dateMonth + 1) + "-" + req.body.dateAll.dateDate + "' AND petty_date <= '" + req.body.date.dateYear + "-" + (req.body.date.dateMonth + 1) + "-" + req.body.date.dateDate + "'", (err, result1) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            const sortedRecord = db.query("SELECT * FROM petty_cash WHERE organisation_id= " + organisationId + " AND  petty_date >= '" + req.body.dateAll.dateYear + "-" + (req.body.dateAll.dateMonth + 1) + "-" + req.body.dateAll.dateDate + "' AND petty_date <= '" + req.body.date.dateYear + "-" + (req.body.date.dateMonth + 1) + "-" + req.body.date.dateDate + "'", (err, result2) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
                else {
                    res.send({
                        status: messages.SUCCESS,
                        data: {
                            pettyResult: pettyResult,
                            result1: result1,
                            result2: result2
                        },
                    });
                }
            });
        });
    })
};


const update = async (req, res) => {
    // pettyRouter.post("/update", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId)
    let prev_closing_balance;
    const dataUpper = await db.query(
        "SELECT * FROM `petty_cash` WHERE petty_cash_id < '" + req.body.id + "' AND organisation_id='" + organisationId + "' ORDER BY `petty_cash_id` DESC LIMIT 0,1",
        (err, resultU) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            if (resultU == "") {
                prev_closing_balance = 0;
            }
            else {
                prev_closing_balance = resultU[0].closing_balance
            }
            if (req.body.transactionType == "credit") {
                totalAmount = parseInt(prev_closing_balance) + parseInt(req.body.amount)
            }
            else if (req.body.transactionType == "debit") {
                totalAmount = prev_closing_balance - req.body.amount
            }
            prev_closing_balance = totalAmount;
            const result = db.query(
                "UPDATE petty_cash SET `amount` = '" +
                req.body.amount +
                "' , `description` = '" +
                req.body.description +
                "' , `transaction_type` = '" +
                req.body.transactionType +
                "' , `closing_balance` = '" +
                totalAmount +
                "' , `petty_date` = '" +
                req.body.date.dateYear + "-" + req.body.date.dateMonth + "-" + req.body.date.dateDate +
                "' WHERE petty_cash_id =?",
                req.body.id,
                (err, result) => {
                    if (err) {
                        res.send({
                            status: messages.ERROR,
                            error: err,
                        });
                    }
                    // console.log(result)
                    else {
                        const dataLower = db.query(
                            "SELECT * FROM `petty_cash` WHERE petty_cash_id > '" + req.body.id + "' AND organisation_id='" + organisationId + "' ORDER BY `petty_cash_id`",
                            (err, resultL) => {
                                // console.log(resultL, "resultL307");
                                if (err) {
                                    res.json({
                                        status: messages.ERROR,
                                        error: err,
                                    });
                                }
                                for (let i = 0; i < resultL.length; i++) {
                                    // console.log(resultL, "resultL")
                                    let totalAmount = 0;
                                    if (resultL[i].transaction_type == "debit") {
                                        totalAmount = prev_closing_balance - resultL[i].amount
                                    }
                                    else if (resultL[i].transaction_type == "credit") {
                                        totalAmount = parseInt(prev_closing_balance) + parseInt(resultL[i].amount)
                                    }
                                    // console.log("UPDATE petty_cash SET `amount` = '" +
                                    //     resultL[i].amount +
                                    //     "' , `description` = '" +
                                    //     resultL[i].description +
                                    //     "' , `transaction_type` = '" +
                                    //     resultL[i].transaction_type +
                                    //     "' , `closing_balance` = '" +
                                    //     totalAmount +
                                    //     "' , `petty_date` = '" +
                                    //     resultL[i].petty_date +
                                    //     "' WHERE petty_cash_id =?",
                                    //     resultL[i].petty_cash_id, "");

                                    // console.log(resultL[i].petty_date, "337");
                                    const result = db.query(
                                        "UPDATE petty_cash SET `amount` = '" +
                                        resultL[i].amount +
                                        "' , `description` = '" +
                                        resultL[i].description +
                                        "' , `transaction_type` = '" +
                                        resultL[i].transaction_type +
                                        "' , `closing_balance` = '" +
                                        totalAmount +
                                        "'  WHERE petty_cash_id =?",
                                        resultL[i].petty_cash_id,

                                        (err, result) => {
                                            if (err) {
                                                res.json({
                                                    status: messages.ERROR,
                                                    error: err,
                                                });
                                            }
                                        }
                                    );
                                    prev_closing_balance = totalAmount;
                                }
                            }
                        )
                        res.send({
                            status: messages.SUCCESS,
                            data: "Petty cash update successfully",
                        })
                    }
                });
        })
};


const deletePetty = async (req, res) => {
    // pettyRouter.post("/delete", verify, async (req, res) => {

    const organisationId = decrypt(req.body.organisationId)

    // console.log("okokok : ", organisationId, req.body.petty_id)

    let prev_closing_balance;
    let totalAmount;
    const result = await db.query(
        "DELETE FROM petty_cash WHERE petty_cash_id=?",
        req.body.petty_id,
        (err, result) => {
            if (err) {

                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
        }
    );
    const dataUpper = db.query(
        "SELECT * FROM `petty_cash` WHERE petty_cash_id < '" + req.body.petty_id + "' AND organisation_id='" + organisationId + "' ORDER BY `petty_cash_id` DESC LIMIT 0,1",
        (err, resultU) => {
            // console.log('resultU', resultU)
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            if (resultU == "") {
                prev_closing_balance = 0;
            }
            else {
                prev_closing_balance = resultU[0].closing_balance
            }
            // console.log(prev_closing_balance, "prev_closing_balance");
        })
    const dataLower = db.query(
        "SELECT * FROM `petty_cash` WHERE petty_cash_id > '" + req.body.petty_id + "' AND organisation_id='" + organisationId + "' ORDER BY `petty_cash_id`",
        (err, resultL) => {
            // console.log('resultL', resultL)
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            for (let i = 0; i < resultL.length; i++) {
                let totalAmount = 0;
                if (resultL[i].transaction_type == "debit") {

                    totalAmount = prev_closing_balance - resultL[i].amount
                }
                else if (resultL[i].transaction_type == "credit") {
                    totalAmount = parseInt(prev_closing_balance) + parseInt(resultL[i].amount)
                }
                const result = db.query(
                    "UPDATE petty_cash SET `amount` = '" +
                    resultL[i].amount +
                    "' , `description` = '" +
                    resultL[i].description +
                    "' , `transaction_type` = '" +
                    resultL[i].transaction_type +
                    "' , `closing_balance` = '" +
                    totalAmount +
                    "' , `petty_date` = '" +
                    resultL[i].petty_date +
                    "' WHERE petty_cash_id =?",
                    resultL[i].petty_cash_id,
                    (err, result) => {
                        if (err) {
                            res.send({
                                status: messages.ERROR,
                                error: err,
                            });
                        }
                    });
                prev_closing_balance = totalAmount;
            }
            res.send({
                status: messages.SUCCESS,
                data: resultL,
            });
        });
}

module.exports = {
    add,
    prefillPettyInfo,
    getList,
    searchDate,
    update,
    deletePetty

};


