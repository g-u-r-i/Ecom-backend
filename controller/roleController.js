const db = require("../config/dbConnection");
const messages = require("../consts.js");

// const verify = require("../middleware/verify.js");
// const express = require("express");
// const roleRouter = express.Router();
// const app = express();
// const jwt = require("jsonwebtoken");
// const jwtExpirySeconds = 6000;
// const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";

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

//   const maxSize = 200* 1024 *1024;
//   const upload = multer({ storage: storage, limits: { fileSize: maxSize } });
//   const upIm = upload.single('data[file][0]');

const getRoles = async (req, res) => {
    // roleRouter.get("/get-roles", async (req, res) => {
    const result = await db.query("SELECT * FROM custom_roles WHERE role != 'owner'", (err, result) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        // console.log("roles", result)
        res.send({
            status: messages.SUCCESS,
            data: result,
        });
    });
};


const deleteRole = async (req, res) => {
    // roleRouter.post("/delete", async (req, res) => {
    const id = req.body.custom_role_id;
    const result = await db.query(
        "DELETE FROM custom_roles WHERE custom_role_id=?",
        id,
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


const prefillRoleInfo = async (req, res) => {
    // roleRouter.post("/prefill-role-info", async (req, res) => {
    const data = await db.query(
        "SELECT * FROM custom_roles WHERE custom_role_id=?",
        req.body.id,
        (err, result) => {
            if (err) {
                // console.log("result");
                console.log(err);
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


const updateRole = async (req, res) => {
    // roleRouter.post("/update",  async (req, res) => {
    // console.log(req.body);
    const result = await db.query(
        "UPDATE custom_roles SET `role` = '" +
        req.body.role +
        "' WHERE custom_role_id =?",
        req.body.id,
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            // console.log(result);
            res.send({
                status: messages.SUCCESS,
                data: "Data saved successfully",
            });
        });
};

const getRolesByPost = async (req, res) => {
    //    roleRouter.post("/get-roles", async (req, res) => {
    const firstPost = req.body.firstPost;
    const listingPerPage = req.body.listingPerPage;
    let roleResult;
    const organisationId = decrypt(`${req.body.organisationId}`)
    const result = await db.query("SELECT * FROM custom_roles WHERE role != 'owner' AND organisation_id=" + organisationId + "  LIMIT " + firstPost + ", " + listingPerPage + "   ", (err, result1) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        roleResult = result1;
        const totalRecord = db.query("SELECT COUNT(*) as count FROM custom_roles WHERE organisation_id=" + organisationId + "", (err, result) => {
            if (err) {

                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            res.send({
                status: messages.SUCCESS,
                data: { roleResult: result1, result: result }
            });
        });
    });
};

const getRolesAndPermission = async (req, res) => {
    //    roleRouter.post("/get-roles-and-permissions", async (req, res) => {
    const organisationId = decrypt(`${req.body.organisationId}`)
    const result1 = await db.query("SELECT * FROM `custom_roles`  where organisation_id=" + organisationId + " AND role != 'owner' ", (err, result1) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        } else {
            const result2 = db.query("SELECT * FROM `permissions`", (err, result2) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                } else {
                    const result3 = db.query("SELECT * FROM `permissions_assigned`WHERE `organisation_id`=?", organisationId, (err, result3) => {
                        if (err) {
                            res.send({
                                status: messages.ERROR,
                                error: err,
                            });
                        } else {
                            res.send({
                                status: messages.SUCCESS,
                                data: {
                                    role: result1,
                                    permission: result2,
                                    permittedData: result3
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};


const setPermissions = async (req, res) => {
    // roleRouter.post("/set-permissions", async (req, res) => {
    //DELETE all assigned permissions
    const organisation_id = decrypt(`${req.body.organisationId}`)
    // console.log("body", req.body)
    await db.query("DELETE FROM `permissions_assigned` WHERE `organisation_id`=?", organisation_id)
    //INSERT new  permissions to assignee
    for (var i = 0; i < req.body.data.length; i++) {
        // console.log(req.body.data[i].role_id, "req.body.data[i].role");
        const result = await db.query("INSERT INTO `permissions_assigned`(`role_id`, `permission_id`, `organisation_id`) VALUES('" +
            req.body.data[i].role_id +
            "', " +
            req.body.data[i].permission_id +
            ", '" +
            organisation_id +
            "')", (err, result) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
            });
    }
    res.send({
        status: messages.SUCCESS,
        data: 'Role Update Sucessfully'
    });
};


const addRole = async (req, res) => {
    // roleRouter.post("/add", async (req, res) => {
    const organisation_id = decrypt(`${req.body.organisationId}`)
    //check if role already exists
    await db.query("SELECT * FROM custom_roles where organisation_id=" + organisation_id + " AND role='" + req.body.role + " '", (err, checkExisting) => {

        if (err) {
            console.log(err)
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        else {
            if (checkExisting.length == 0) {

                const result = db.query("INSERT INTO `custom_roles`(`role`, `organisation_id`) VALUES('" +
                    req.body.role +
                    "', '" +
                    organisation_id +
                    "')", (err, result) => {

                        // console.log("result : ", result);
                        if (err) {
                            res.send({
                                status: messages.ERROR,
                                error: err,
                            });
                        } else {
                            res.send({
                                status: messages.SUCCESS,
                                data: "role added successfully"
                            });
                        }
                    });
            }
            else {
                res.send({
                    status: messages.ROLE_ALREADY_EXISTS,
                    data: "already exist"

                });
            }
        }
    });
};

module.exports = {
    getRoles,
    deleteRole,
    prefillRoleInfo,
    updateRole,
    getRolesByPost,
    getRolesAndPermission,
    setPermissions,
    addRole

};