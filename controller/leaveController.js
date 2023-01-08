// const verify = require("../middleware/verify.js");
// const express = require("express");
// const leaveRouter = express.Router();
// const app = express();
// const jwt = require("jsonwebtoken");
// const jwtExpirySeconds = 6000;
// const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";

const messages = require("../consts.js");
const db = require("../config/dbConnection");
var permission = require('../Permission/Permission.json')

// const bodyParser = require('body-parser')
// require('dotenv').config();
// app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(express.json());


const multer = require('multer');
const path = require('path');
const { encrypt, decrypt } = require("../UtilFunctions/utilFunctions.js");
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


const newLeave = async (req, res) => {
    // leaveRouter.post("/newleave", async (req, res) => {
    const id = decrypt(req.body.id)
    // console.log(req.body)
    const data = db.query(
        "INSERT INTO `leave_mangement`(`user_id`, `reason`, `leave_from`, `leave_to`, `date`) VALUES (" + id + ",'" + req.body.reason + "','" + req.body.dateFrom.year + "-" + req.body.dateFrom.month + "-" + req.body.dateFrom.date + "', '" + req.body.dateTo.year + "-" + req.body.dateTo.month + "-" + req.body.dateTo.date + "',  " + req.body.currentDate + ")",
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                res.send({
                    status: messages.SUCCESS,
                    data: 'leave sucessfully submitted',
                });
            }
        });
};


const getMyLeaves = async (req, res) => {
    //  leaveRouter.post("/get-my-leaves", async (req, res) => {
    // const id = decrypt(req.body.id)
    // let getLeaveResut

    const organisationId = decrypt(req.body.organisationId)

    const name = req.body.name;
    const status = req.body.status
    const listPerPage = req.body.listingPerPage;
    const firstPost = req.body.firstPost
  
    const id = decrypt(req.body.id)
    let getLeaveResut
    const data = await db.query(
      "SELECT leave_mangement_id, leave_mangement.user_id, reason, leave_from, leave_to, leave_mangement.date, leave_mangement.status FROM leave_mangement INNER JOIN users on users.user_id=leave_mangement.user_id  WHERE leave_mangement.user_id=" + id + "  AND users.organisation_id="+organisationId+" LIMIT " + firstPost + ", " + listPerPage + " ", (err, results) => {
        if (err) {
          res.send({
            status: messages.ERROR,
            error: err,
          });
        } const totalRecord = db.query("SELECT COUNT(*) as count FROM `leave_mangement` INNER JOIN users on users.user_id=leave_mangement.user_id  WHERE leave_mangement.user_id=" + id + "  AND users.organisation_id="+organisationId+"  ", (err, result) => {
          if (err) {
  
            res.send({
              status: messages.ERROR,
              error: err,
            });
          }
  
          res.send({
            status: messages.SUCCESS,
            data: { leaveResult: results, totalRecordCount: result },
                   });
        });
  
      })




















    // console.log("5555 : ","SELECT * FROM `leave_mangement`  WHERE user_id=" + id + " ")
    // const data = await db.query(
    //     "SELECT * FROM `leave_mangement`  WHERE user_id=" + id + " ", (err, result) => {
    //         if (err) {
    //             res.send({
    //                 status: messages.ERROR,
    //                 error: err,
    //             });
    //         } else {
    //             res.send({
    //                 status: messages.SUCCESS,
    //                 data: result,
    //             });
    //         }
    //     });
};


const getLeaves = async (req, res) => {
    // leaveRouter.post("/get-leaves", async (req, res) => {
    const organisation_id = decrypt(req.body.organisationId)
    const listPerPage = req.body.listingPerPage;
    const firstPost = req.body.firstPost
    const name = req.body.name
    const status = req.body.status
    // console.log(req.body.name)
    // console.log(req.body.status, "JHGFJDddddjf")
    let whereClause = ""
    if (name != "" && name != null) {
        whereClause = whereClause + " AND users.name LIKE '%" + name + "%' "
    }
    if (status != "all" && name != null) {
        whereClause = whereClause + " AND leave_mangement.status= '" + status + "' "
    }
    const data = await db.query(
        "SELECT `leave_mangement_id`, name, leave_mangement.user_id, `reason`, `leave_from`, `leave_to`, leave_mangement.date, leave_mangement.status FROM `leave_mangement` INNER JOIN `users` ON leave_mangement.user_id=users.user_id   WHERE  users.organisation_id=" + organisation_id + "  " + whereClause + "  LIMIT " + firstPost + ", " + listPerPage + " ", (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            getLeaveResut = result
            const totalRecord = db.query("SELECT COUNT(*) as count  FROM leave_mangement INNER JOIN `users` ON leave_mangement.user_id=users.user_id   WHERE  users.organisation_id=" + organisation_id + " " + whereClause + "", (err, result) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
                // console.log(result)
                res.send({
                    status: messages.SUCCESS,
                    data: { getLeaveResut: getLeaveResut, totalRecordCount: result },
                });
            });
        });
};


const leavesStatus = async (req, res) => {
    // leaveRouter.post("/leavestatus", async (req, res) => {
    const userId = decrypt(req.body.user_id)
    const id = req.body.id
    const data = await db.query(
        "UPDATE `leave_mangement` SET status= '" + req.body.status + "' WHERE leave_mangement_id=" + id + " ", (err, result) => {
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


const deleteLeaves = async (req, res) => {
    // leaveRouter.post("/deleteleave", async (req, res) => {
    const result = await db.query(
        "DELETE FROM leave_mangement WHERE leave_mangement_id=?",
        req.body.id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            res.send({
                status: messages.SUCCESS,
                data: result,
            });
        });
};


const filterData = async (req, res) => {
    // leaveRouter.post("/filterData", async (req, res) => {
    const organisation_id = decrypt(req.body.organisationId)
    let whereClause = "";
    const name = req.body.name;
    const status = req.body.status
    const listPerPage = req.body.listingPerPage;
    const firstPost = req.body.firstPost
    if ((name != '') || (name != undefined)) {
        whereClause = whereClause + " AND users.name LIKE '%" + name + "%' "
    }
    if (status != 'all') {
        whereClause = whereClause + " AND leave_mangement.status= '" + status + "' "
    }
    // const name=req.body.name
    // console.log("req.body.name", req.body.name)
    const result = await db.query("SELECT leave_mangement_id, name, leave_mangement.user_id, reason, leave_from, leave_to, leave_mangement.date, leave_mangement.status FROM leave_mangement INNER JOIN users ON leave_mangement.user_id=users.user_id WHERE organisation_id =" + organisation_id + " " + whereClause + " LIMIT " + firstPost + ", " + listPerPage + " ", (err, result) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        // console.log(result, "jyjh")
        const totalRecord = db.query("SELECT COUNT(*) as count  FROM leave_mangement INNER JOIN `users` ON leave_mangement.user_id=users.user_id   WHERE  users.organisation_id=" + organisation_id + " " + whereClause + "", (err, result2) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            res.send({
                status: messages.SUCCESS,
                data: { result: result, totalRecordCount: result2 },
            });
        });
    })
};


module.exports = {
    newLeave,
    getMyLeaves,
    getLeaves,
    leavesStatus,
    deleteLeaves,
    filterData

};
