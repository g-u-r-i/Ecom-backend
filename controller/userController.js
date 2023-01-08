// const nodemailer = require("nodemailer");
const db = require("../db/conn");
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken')
const message = require('../messages/Message')
const saltRounds = 10;
const jwtKey = "guri"
const verifyToken=require('../Middleware/verify')
// const messages = require("../consts.js");
// var permission = require('../Permission/Permission.json')
const { decrypt } = require("../UtilFunction/Utilfunction");
const { encrpyt } = require("../UtilFunction/Utilfunction");

// const verify = require("../middleware/verify.js");
// const express = require("express");
// const userRouter = express.Router();
// const app = express();
// const jwt = require("jsonwebtoken");
// const jwtExpirySeconds = 6000;

// const authToken = "s2r9BRLCmEXQ2WEdfQjApE8CC6yFhX7w";
// const db = require("../connection/db.js");

// const bodyParser = require('body-parser')
// require('dotenv').config();
// app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(express.json());


// const multer = require('multer');
// const path = require('path');
// const { encrypt, decrypt } = require("../UtilFunctions/utilFunctions.js");
// const uuid = require('uuid').v4;
// const DIR = '../Assets/';
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.toLowerCase().split(' ').join('-');
//         const filePath = uuid() + '-' + fileName;
//         cb(null, filePath);

//     }
// });



// const maxSize = 200 * 1024 * 1024;
// const upload = multer({ storage: storage, limits: { fileSize: maxSize } });
// const upIm = upload.single('data[file][0]');


// const auth = async (req, res) => {
//     // userRouter.post("/auth", async (req, res) => {
//     // console.log(req.body)
//     if (req.body.authToken == authToken) {
//         const { username, password } = req.body.data;
//         let data = req.body;

//         console.log(data)
//         db.connect(async () => {
//             try {
//                 const result = await db.query(
//                     "SELECT users.user_id, name, email, role_id, users.organisation_id, status, date,role FROM users INNER JOIN custom_roles ON users.role_id=custom_roles.custom_role_id where email="+req.body.data.email+" AND users.role_id=custom_roles.custom_role_id",

//                     (err, result) => {
//                         console.log(result)
//                         if (err) {
//                         }
//                         console.log(result)
//                         if (result.length == 0) {
//                             res.send({
//                                 status: messages.ERROR,
//                                 data: messages.USER_DOES_NOT_EXIST,
//                             });
//                         }
//                         if (result.length != 0) {
//                             if (data.data.password == result[0].password) {
//                                 let email = req.body.data.email;
//                                 const token = jwt.sign(
//                                     { email: req.body.data.email },
//                                     process.env.Access_Token_Secret,
//                                     {
//                                         algorithm: "HS256",
//                                         expiresIn: jwtExpirySeconds,
//                                     }
//                                 );

//                                 var role_name;

//                                 const encoded_organisation_id = encrypt(result[0].organisation_id)
//                                 const encoded_user_id = encrypt(result[0].user_id)
//                                 const encoded_role_id = encrypt(result[0].role_id)
//                                 const encoded_role_name = encrypt(result[0].roleName)
//                                 res.send({
//                                     status: messages.SUCCESS,
//                                     data: {
//                                         token: token,
//                                         maxAge: jwtExpirySeconds * 1000,
//                                         email: result[0].email,
//                                         user_id: encoded_user_id,
//                                         role_id: encoded_role_id,
//                                         status: result[0].status,
//                                         date: result[0].date,
//                                         organisation_id: encoded_organisation_id,
//                                         role_name: encoded_role_name
//                                     },
//                                 });
//                             } else {
//                                 res.send({
//                                     status: messages.ERROR,
//                                     data: messages.WRONG_PASSWORD,
//                                 });
//                             }
//                         }
//                     }
//                 );
//             } catch (err) {
//             }

//         })

//     } else {
//         res.send({
//             status: messages.ERROR,
//             data: messages.UNAUTHENTICATED_USER,
//         });
//     }
// };


const signUp = async (req, res) => {
    // userRouter.post("/signup", async (req, res) => {
    let organisation_id;
    let roleresult1;
    let role_id;

    const checkEmail = await db.query("select * from users where email='" + req.body.email + "'", (err, result) => {
        // console.log("koooo : ", result)

        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        else if (result.length > 0) {
            res.send({
                status: messages.SUCCESS,
                data: "Email Already Exists",
            })
        } else {
            // console.log('organisationid', req.body.organisationame)
            const result = db.query("INSERT INTO organisation (organisation_name) VALUES ('" + req.body.organisationame + "')", (err, result) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
                organisation_id = result.insertId;
                console.log(organisation_id, 'organisation_id')
            })
            const role = db.query("SELECT * from roles", (err, result) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
                for (let i = 0; i < result.length; i++) {
                    const insertRole = db.query("INSERT INTO custom_roles (role,organisation_id) VALUES ('" + result[i].role + "'," +
                        organisation_id + ")",
                        (err, result1) => {
                            if (err) {
                                res.send({
                                    status: messages.ERROR,
                                    error: err,
                                });
                            }
                            if (result[i].role == "owner") {
                                roles = result1.insertId
                                role_id = result1.insertId
                                const insertUser = db.query("INSERT INTO `users` (`name`,`email`, `password`, `role_id`, `status`, `date`, `organisation_id`) VALUES ('" +
                                    req.body.name +
                                    "', '" +
                                    req.body.email +
                                    "', '" +
                                    req.body.password +
                                    "', '" +
                                    result1.insertId +
                                    "', '" +
                                    'active' +
                                    "', '" +
                                    req.body.date +
                                    "', '" +
                                    organisation_id +
                                    "')",
                                    (err, result) => {
                                        if (err) {
                                            res.json({
                                                status: messages.ERROR,
                                                error: err,
                                            });
                                        } else {
                                            res.json({
                                                status: messages.SUCCESS,
                                                data: "Register successfully",
                                            });
                                        }
                                    }
                                );
                            } else {
                                let currentRole = permission[result[i].role];
                                for (let i = 0; i < currentRole.length; i++) {
                                    const resultss = db.query("INSERT INTO `permissions_assigned`  (`role_id`, `permission_id`, `organisation_id`) VALUES(" + result1.insertId + "," + currentRole[i] + "  , " + organisation_id + ")", (err, result) => {
                                        if (err) {
                                            res.send({
                                                status: messages.ERROR,
                                                error: err,
                                            });
                                        }

                                    });

                                }
                            }
                        })
                }
                const setting = db.query("SELECT setting_name, default_value,field_Label FROM `master_setting`  ", (err, result) => {
                    if (err) {

                        res.json({
                            status: messages.ERROR,
                            error: err,
                        });

                    }
                    for (var i = 0; i < result.length; i++) {
                        const insertSetting = db.query("INSERT INTO `custom_setting` (`setting_name`, `setting_value`, label,`organisation_id` ) VALUES ('" +
                            result[i].setting_name +
                            "', '" +
                            result[i].default_value +
                            "','" + req.body.field_label + "','" +
                            organisation_id +
                            "')",
                            (err, result1) => {
                                if (err) {
                                    res.json({
                                        status: messages.ERROR,
                                        error: err,
                                    });
                                }
                            }
                        );
                    }
                })
            })
        }
    })
};


const addNew = async (req, res) => {
    // userRouter.post("/add-new", async (req, res) => {

    // console.log("KKK : ", req.body)

    const organisationId = decrypt(req.body.organisationId)
    const checkExisting = db.query(
        "SELECT * FROM users WHERE email=? AND organisation_id=" + organisationId + "",
        req.body.email,
        (err, result2) => {

            // console.log("result2  : ", result2)

            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }

            if (result2 == null || result2.length == 0) {

                const result3 = db.query(
                    "INSERT INTO `users` (`name`,`email`, `password`, `role_id`, `status`, `date`, `organisation_id`) VALUES ('" +
                    req.body.name +
                    "', '" +
                    req.body.email +
                    "', '" +
                    req.body.password +
                    "', '" +
                    req.body.roleId +
                    "', '" +
                    req.body.status +
                    "', '" +
                    req.body.date +
                    "', '" +
                    organisationId +
                    "')",
                    (err, result) => {


                        let transporter = nodemailer.createTransport({
                            host: "smtp-relay.sendinblue.com",
                            port: 587,
                            secure: false,
                            auth: {
                                user: "randeep.webframez@gmail.com",
                                pass: "V3EGFH4CmOMNwJS6",
                            },
                        });

                        transporter.sendMail({
                            from: "salil.webframez@gmail.com",
                            to: req.body.email,
                            subject: "HR_Management Credentials",
                            html: "Hi " + req.body.name + ", <br> </br>Your login id and password for the HR_Management is below: <br> </br>  <b> Email: " + req.body.email + " <br></br> Password: " + req.body.password + " </b> <br> </br> Thank you  ",
                        });


                        if (err) {
                            res.json({
                                status: messages.ERROR,
                                error: err,
                            });
                        }
                        res.json({
                            status: messages.SUCCESS,
                            data: "User saved successfully",



                            // for node mailer parent


                        });
                    }
                );
            } else {
                res.send(messages.ALREADY_EXISTS);
            }
        }
    );
    let data = req.body;


}

const getUsers = async (req, res) => {
    // userRouter.post("/get-users", async (req, res) => {
    const organisation = decrypt(req.body.organisationId);
    const listPerPage = req.body.listingPerPage;
    const firstPost = req.body.firstPost;
    const search = req.body.search;
    const role = req.body.role;
    const status = req.body.status;

    let whereClause = "";

    if (search != "" && search != "undefined") {
        whereClause = whereClause + " AND( users.name LIKE '%" + search + "%' OR users.email LIKE '%" + search + "%' ) "
    }
    if (role != 'all' && role != "undefined" && role != "") {
        whereClause = whereClause + " AND users.role_id =" + parseInt(role) + ""
    }
    if (status != "all" && status != "undefined" && status != "") {
        whereClause = whereClause + " AND users.status ='" + status + "' "
    }

    const result = await db.query("SELECT users.user_id,users.name,users.email, users.role_id as roleId,users.status,custom_roles.role as roleName  FROM `users` INNER JOIN `custom_roles` ON users.role_id=custom_roles.custom_role_id WHERE custom_roles.role != 'owner' AND users.organisation_id=" + organisation + " " + whereClause + "   LIMIT " + firstPost + ", " + listPerPage + "   ", (err, results) => {
        if (err) {
            res.send({
                status: messages.ERROR,
                error: err,
            });
        }
        const totalRecord = db.query("SELECT COUNT(*) as count FROM users INNER JOIN `custom_roles` ON users.role_id=custom_roles.custom_role_id WHERE custom_roles.role != 'owner' AND users.organisation_id=" + organisation + " " + whereClause + " ", (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            else {
                res.send({
                    status: messages.SUCCESS,
                    data: { resultRole: results, result: result },
                });
            }
        });
    });
};


const deleteUser = async (req, res) => {
    // userRouter.post("/delete-user", verify, async (req, res) => {
    const result = await db.query(
        "DELETE FROM users WHERE user_id=?",
        req.body.userId,
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
        }
    );
};

const getPrefillData = async (req, res) => {
    // userRouter.post("/get-prefilled-data", verify, async (req, res) => {
    const getPrefilledData = await db.query(
        "SELECT user_id,name,email,password,users.role_id as roleId,status,custom_roles.role as roleName FROM `users` INNER JOIN `custom_roles` ON users.role_id=custom_roles.custom_role_id  where users.user_id=?  ",
        req.body.userId,
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
        }
    );
};

const updateUser = async (req, res) => {
    // userRouter.post("/update-user", verify, async (req, res) => {
    const id = req.body.userId;
    const result = await db.query(
        "UPDATE users SET `name` = '" +
        req.body.name +
        "' ,`status` ='" +
        req.body.status +
        "', `role_id`='" +
        req.body.role +
        "' WHERE user_id =?",
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
                data: "Data saved successfully",
            });
        }
    );
};

const getAllowedPermissions = async (req, res) => {
    // userRouter.post("/get-allowed-permissions", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId)
    const roleId = decrypt(req.body.roleId)
    const result = await db.query("SELECT permissions.permission_id, permission FROM `permissions_assigned` INNER JOIN permissions  ON permissions.permission_id =permissions_assigned.permission_id  where organisation_id=" + organisationId + " AND role_id=" + roleId + " ", (err, result) => {
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


const prefillUserInfo = async (req, res) => {
    // userRouter.post("/prefill-user-info", async (req, res) => {
    const id = req.body.userId
    const data = await db.query(
        "SELECT * FROM user_information WHERE user_id=?",
        id,
        (err, result) => {
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
        }
    );
};


const customRole = async (req, res) => {
    // userRouter.post('/custom_role', async (req, res) => {
    const organisationId = decrypt(req.body.organisationId)
    const role = await db.query(
        "SELECT * FROM custom_roles where role!='owner' AND organisation_id=" + organisationId + "", (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            else {
                res.send({
                    status: messages.SUCCESS,
                    role: result,
                });
            }
        })
};


const fillUserInfo = async (req, res) => {
    // userRouter.post("/fill-user-info", verify, async (req, res) => {
    const id = req.body.userId;
    const data = await db.query(
        "SELECT * FROM user_information WHERE user_id=?",
        id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                if (result.length == 0) {
                    const result = db.query(
                        "INSERT INTO `user_information` (`user_id`, `full_name`, `contact_number`, `address`, `family_member_name`, `family_member_number`, `department`, `designation`, `dob`, `doj`) VALUES (" +
                        req.body.id +
                        ", '" +
                        req.body.full_name +
                        "', '" +
                        req.body.contact_number +
                        "', '" +
                        req.body.address +
                        "', '" +
                        req.body.family_member_name +
                        "', '" +
                        req.body.family_member_number +
                        "', '" +
                        req.body.department +
                        "', '" +
                        req.body.designation +
                        "', '" +
                        req.body.dob +
                        "', '" +
                        req.body.doj +
                        "')",
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
                        }
                    );
                } else {
                    const result = db.query(
                        "UPDATE user_information SET `full_name` = '" +
                        req.body.full_name +
                        "' , `contact_number` = '" +
                        req.body.contactNumber +
                        "' , `address` ='" +
                        req.body.address +
                        "', `family_member_name`='" +
                        req.body.family_member_name +
                        "', `family_member_number`='" +
                        req.body.family_member_number +
                        "', `department`='" +
                        req.body.department +
                        "', `designation`='" +
                        req.body.designation +
                        "', `dob`='" +
                        req.body.date.dateYear + "-" + req.body.date.dateMonth + "-" + req.body.date.dateDate +
                        "', `doj`='" +
                        req.body.doj +
                        "' WHERE user_id =?",
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
                                data: "Data saved successfully",
                            });
                        }
                    );
                }
            }
        }
    );
};


const preFilledUserBankDetail = async (req, res) => {
    // userRouter.post("/prefill-user-bank-details", verify, async (req, res) => {
    const id = req.body.userId
    const data = await db.query(
        "SELECT * FROM user_bank_details WHERE user_id=?",
        id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                if (result.length != null) {
                    res.send({
                        status: messages.SUCCESS,
                        data: result,
                    });
                }
            }
        });
};


const fillUserBankDetail = async (req, res) => {
    // userRouter.post("/fill-user-bank-details", async (req, res) => {
    const id = req.body.userId;
    const data = await db.query(
        "SELECT * FROM user_bank_details WHERE user_id=?",
        id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                if (result.length == 0 || result == null) {
                    const result = db.query(
                        "INSERT INTO `user_bank_details` (`user_id`, `account_number`, `account_holder`, `ifsc`, `bank`) VALUES (" +
                        id +
                        ", '" +
                        req.body.accountNumber +
                        "', '" +
                        req.body.accountHolder +
                        "', '" +
                        req.body.ifsc +
                        "', '" +
                        req.body.bank +
                        "')",
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
                } else {
                    const result = db.query(
                        "UPDATE user_bank_details SET `account_number` = '" +
                        req.body.accountNumber +
                        "' , `account_holder` = '" +
                        req.body.accountHolder +
                        "' , `ifsc` ='" +
                        req.body.ifsc +
                        "', `bank`='" +
                        req.body.bank +
                        "' WHERE user_id =?",
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
                                data: "Data saved successfully",
                            });
                        });
                }
            }
        });
};


const submitUserDocument = async (req, res) => {
    // userRouter.post("/submit-user-document", async (req, res) => {
    const id = req.body.userId;
    const data = await db.query(
        "SELECT * FROM user_documents WHERE user_id=?",
        id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                if (result.length == 0 || result == null) {
                    const result = db.query(
                        "INSERT INTO `user_documents` (`user_id`, `document_name`, `document_id`) VALUES (" +
                        id +
                        ", '" +
                        req.body.document_name +
                        "', '" +
                        req.body.document_id +
                        "')",
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
                } else {
                    const result = db.query(
                        "UPDATE user_documents SET `document_name` = '" +
                        req.body.documentName +
                        "' , `document_id` = '" +
                        req.body.documentId +
                        "' WHERE user_id =?",
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
                                data: "Data saved successfully",
                            });
                        });
                }
            }
        });
};


const prefillUserDocument = async (req, res) => {
    // userRouter.post("/prefill-user-document", verify, async (req, res) => {
    const id = req.body.userId
    const data = await db.query(
        "SELECT * FROM user_documents WHERE user_id=?",
        id,
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            } else {
                if (result.length != null) {
                    res.send({
                        status: messages.SUCCESS,
                        data: result,
                    });
                }
            }
        });
};


const getSettings = async (req, res) => {

    await db.query("SELECT * FROM setting ",
        (err, result) => {
            if (err) {
                res.send({
                    status: messages.ERROR,
                    error: err,
                });
            }
            else {
                res.send({
                    status: messages.SUCCESS,
                    data: result,
                });
            }
        })
};


const settingUpdates = async (req, res) => {
    // userRouter.post("/setting-updates", async (req, res) => {
    const organisationId = decrypt(req.body.organisationId)
    for (let i = 0; i < req.body.data.length; i++) {
        const updateSetting = db.query(
            "UPDATE custom_setting SET  setting_value=" + req.body.data[i].settingValue + " WHERE custom_setting_id=" + req.body.data[i].settingId + " AND organisation_id= " + organisationId + "",
            (err, result) => {
                if (err) {
                    res.send({
                        status: messages.ERROR,
                        error: err,
                    });
                }
            })
    }
    res.send({
        data: 'Setting update successfully',
        status: messages.SUCCESS,
    });
};


const changePassword =  async (req, res) => {
    //  userRouter.post("/change-password", async (req, res) => {
    // console.log(req.body, "password");
    // console.log(decrypt(req.body.userId), "819");
    // console.log(decrypt(req.body.organisationId), "")
    const organisationId = decrypt(req.body.organisationId);
    const userId = decrypt(req.body.userId);
    const result = await db.query(
        "SELECT * FROM users WHERE user_id =" + userId + " AND `organisation_id` = " + organisationId + "",
        (err, result) => {
            // console.log(result, "827");
            if (result[0].password == req.body.oldpassword) {
                const updatePassword = db.query(
                    "UPDATE users SET  password=" + req.body.password + " WHERE user_id=" + userId + " AND organisation_id= " + organisationId + "",
                    (err, result1) => {
                        if (err) {
                            res.send({
                                status: messages.ERROR,
                                error: err,
                            });
                        }
                        else {
                            res.send({
                                status: messages.SUCCESS,
                                data: "password change successfully",
                            });
                        }
                    });
            }
            else {
                res.send({
                    status: messages.ERROR,
                    error: "please  check your password",
                });
            }
        });
};

let Token = ""


const auth = async (req, res) => {
    const email = decrypt(req.body.email)
    const password = decrypt(req.body.password)
    console.log("object", decrypt(req.body.password))
    const result = await db.query("SELECT * FROM login WHERE email='" + email + "' AND password= '" + password + "' ", (err, result) => {
        if (err) {
            res.send({
                status: 'err',
            })
        }
        console.log("rs", result)

        if (result.length > 0) {
            const encoded_id = encrpyt(result[0].id)
            const encoded_email = encrpyt(result[0].email)
            let data = ({ id: encoded_id, email: encoded_email })
            Jwt.sign({ data }, jwtKey, { expiresIn:"2" }, (err, token) => {
                if (err) {
                    res.send("Something Went Wron")
                }
                Token = token
                res.send({ data, auth: token })
            })
        }
        else {
            res.send({
                status: 'error',
                data:"email & password is incorrect"
            })
        }


      

    })

}

const setting = (req, res) => {
 
    db.query("INSERT INTO `setting`(`sitename`, `logo`, `address`, `email`, `contact_number`)  VALUES ('"+req.body.sitename+"','"+req.file.filename+"','" + req.body.address + "' ,'" + req.body.email + "','" + req.body.contactnumber + "')", (err, result) => {
        if (err) {
            res.send({
                error: err
            }
            )
        }
        else {
            res.send({
                message: message.SUCCESSFULL_MESSAGE,
                data: result
            })
        }
    })
}

const getSetting = (req, res) => {
 
    
    db.query("SELECT * from  setting" , (err, result) => {
        if (err) {
            res.send({
                error: err
            }
            )
        }
        else {
            res.send({
                // message: message.SUCCESSFULL_MESSAGE,
                data: result
            })
        }
    })
}





const login = (req, res) => {
    // console.log(req.session.user,"user")
    if (Token != "") {
        res.send({ loggedIn: true })
    }
    else {
        res.send({ loggedIn: false })

    }
}



module.exports = {
    setting,
    auth,
    login,
    signUp,
    addNew,
    getUsers,
    deleteUser,
    getPrefillData,
    updateUser,
    getAllowedPermissions,
    prefillUserInfo,
    customRole,
    fillUserInfo,
    preFilledUserBankDetail,
    fillUserBankDetail,
    submitUserDocument,
    prefillUserDocument,
    setting,
    getSetting,
    settingUpdates,
    changePassword

};
