const userController = require('../controller/userController');
const routeUser = require("express").Router();
const verify=require('../Middleware/verify')
const multer = require("multer");
const moment = require("moment")

// img storage confing
var imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}${file.originalname}`)
    }
});


// img filter
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        callback(null,Error("only image is allowd"))
    }
}

var upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})




routeUser.post("/auth", userController.auth);
routeUser.get("/login", userController.login);
routeUser.post("/signup", userController.signUp);
routeUser.post("/add-new", userController.addNew);
routeUser.post("/get-users", userController.getUsers);
routeUser.post("/delete-user", userController.deleteUser);
routeUser.post("/get-prefilled-data", userController.getPrefillData);
routeUser.post("/update-user", userController.updateUser);
routeUser.post("/get-allowed-permissions", userController.getAllowedPermissions);
routeUser.post("/prefill-user-info", userController.prefillUserInfo);
routeUser.post("/custom_role", userController.customRole);
routeUser.post("/fill-user-info", userController.fillUserInfo);
routeUser.post("/prefill-user-bank-details", userController.preFilledUserBankDetail);
routeUser.post("/fill-user-bank-details", userController.fillUserBankDetail);
routeUser.post("/submit-user-document", userController.submitUserDocument);
routeUser.post("/prefill-user-document", userController.prefillUserDocument);
routeUser.get("/getsetting", userController.getSetting);
// routeUser.post("/setting", userController.setting);
routeUser.post("/setting-updates", userController.settingUpdates);
routeUser.post("/change-password", userController.changePassword);
routeUser.post("/setting",upload.single("logo"), userController.setting);


module.exports = routeUser;
