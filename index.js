// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// // const verify = require("./middleware/verify")
const multer = require('multer')

// require("dotenv").config();
// const saltRounds=10
// const cookieParser=require('cookie-parser')
// const session =require('express-session')
// const app = express();
// app.use(cors());
// app.use(session({
//     key:"userId",
//     secret:"guri",
//     resave: false,
//     saveUninitialized: false,
//     cookie:{
//         expires:60 * 60 * 24
//     }
// }))


// const port = 8000;

// //middleware parser
// app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(upload.array()); 
// // app.use(express.static('public'));
// app.use(bodyParser.json());


// const userRouter = require("./routes/UserRouter");
// const router = require('./routes/router');
// const routeCategory = require("./routes/CategoryRouter");
// // const managerRouter = require("./routes/ManagerRouter");
// // const roleRouter = require("./routes/RoleRouter");
// // const attendanceRouter = require("./routes/AttendanceRouter");
// // const pettyRouter = require("./routes/PettyRouter");
// // const holidayRouter = require("./routes/HolidayRouter");
// // const leaveRouter = require("./routes/LeaveRouter");
// // const appraisalRouter = require("./routes/AppraisalRouter");
// // const loanRouter = require("./routes/LoanRouter");



// // app.get('/api', (req, res) => {
// //     res.send("hi")
// // })

// app.use(express.static('public'));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

// const upload = multer({storage}).array('file');

// app.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             return res.status(500).json(err)
//         }

//         return res.status(200).send(req.files)
//     })
// });


// app.use('/user',  userRouter);
// app.use("/category",routeCategory)
// app.use(router );
// // app.use('/manager', managerRouter)
// // app.use('/role', roleRouter);
// // app.use('/attendance', attendanceRouter);
// // app.use('/petty', pettyRouter);
// // app.use('/holiday', holidayRouter);
// // app.use('/leave', leaveRouter);
// // app.use('/appraisal', appraisalRouter);
// // app.use('/loan', loanRouter);
// app.listen(port, () => console.log("listening on port", port));


 
require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const port = 8000;


app.use(express.json());
app.use(cors());

const userRouter = require("./routes/UserRouter");
const routeCategory = require("./routes/CategoryRouter");
const routeProduct = require("./routes/ProductRouter");
const productRouter = require("./routes/ProductRouter")
const router = require("./routes/router")
app.use("/uploads",express.static("./uploads"))
app.use(router)


//! Use of Multer-
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../uploads')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        //callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        callBack(null, path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
 





app.use("/uploads",express.static("./uploads"))
app.use('/user',  userRouter);
app.use("/product",productRouter)
app.use('/category',  routeCategory);
app.listen(port,()=>{
    console.log("server start")
})