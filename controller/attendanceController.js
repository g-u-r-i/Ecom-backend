// const verify = require("../middleware/verify.js");
// const express = require("express");
// const attendanceRouter = express.Router();
// const app = express();
const { encrypt, decrypt } = require("../UtilFunctions/utilFunctions.js");


const db = require("../config/dbConnection");
const messages = require("../consts");
const { formatDate } = require("../UtilFunctions/utilFunctions");


const attendance = async (req, res) => {
    // attendanceRouter.post("/attendance", async (req, res) => {
    const id = decrypt(req.body.userId)
    const todayDate = new Date().toLocaleDateString();
    //   console.log(todayDate, 'todayDate')
    var field = todayDate.split('/')
    var month = field[0];
    var date = field[1];
    while (date.length < 2) date = "0" + date;
    while (month.length < 2) month = "0" + month;
    var year = field[2];
    const data = await db.query(
        "INSERT INTO `attendance` (`user_id`, `time`, `activity`, `date`) VALUES('" +
        id +
        "', '" +
        req.body.time +
        "', '" +
        req.body.activity +
        "', '" +
        `${year}-${month}-${date}` +
        "')",
        (err, result) => {
            if (err) {
                // console.log("result");
                // console.log(err);
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


const getAttendance = async (req, res) => {
    // attendanceRouter.post("/get-attendance", async (req, res) => {
    //  console.log(req.body, 'body')
    const startDate = new Date(req.body.startDate).toLocaleDateString('en-IN');
    // console.log(req.body.searchData)
    const endDate = new Date(req.body.endDate).toLocaleDateString('en-IN');
    //console.log(startDate, endDate, 'startdate')
    const id = decrypt(req.body.userId)
    //   console.log(req.body.userId,"getattendance")
    var field1 = startDate.split('/')
    var date1 = field1[0];
    var month1 = field1[1];
    var year1 = field1[2];
    var field2 = endDate.split('/')
    var date2 = field2[0];
    var month2 = field2[1];
    var year2 = field2[2];
    while (date1.length < 2) date1 = "0" + date1;
    while (month1.length < 2) month1 = "0" + month1;
    while (date2.length < 2) date2 = "0" + date2;
    while (month2.length < 2) month2 = "0" + month2;
    //   console.log(`${year1}-${month1}-${date1}`)
    //   console.log(`${year2}-${month2}-${date2}`)
    const data = await db.query(
        "SELECT * FROM `attendance` WHERE date <=" + `"${year2}-${month2}-${date2}"` + " AND date >=" + `"${year1}-${month1}-${date1}"` + " AND user_id=" + id,
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                // console.log(result, 'result')
                if (result.length > 0) {
                    //   console.log(result.length)
                    //   console.log(startDate, 'startDate')
                    //   console.log(endDate, 'endDate')
                    let stDate = new Date(req.body.startDate);
                    let edDate = new Date(req.body.endDate);
                    var recordsArray = []
                    var records = []
                    var rdx = [];
                    for (let j = stDate; j <= edDate; j.setDate(j.getDate() + 1)) {
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].date == dateFormatChange(j.toLocaleDateString())) {
                                // let d = dateFormatChange(j.toLocaleDateString());
                                // recordsArray[i]={[result[i].date] : result[i]}
                                records.push(result[i])
                            }
                        }
                        if (records.length > 0) {
                            const key = j.toLocaleDateString('en-IN');
                            recordsArray.push({
                                date: key,
                                records: records
                            })
                        }
                        records = []
                    }
                    // console.log(recordsArray, 'recordsArray')
                    res.json({
                        status: messages.SUCCESS,
                        data: recordsArray
                    })
                }
            }
        });
};

function dateFormatChange(dates) {
    var field = dates.split('/')
    var date = field[0];
    var month = field[1];
    var year = field[2];
    while (date.length < 2) date = "0" + date;
    while (month.length < 2) month = "0" + month;
    return year + '-' + date + '-' + month
}

module.exports = {
    attendance,
    getAttendance

};
