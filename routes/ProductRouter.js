const ProductController = require('../controller/ProductController');
const routeProduct = require("express").Router();

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



routeProduct.post("/add",upload.single("productImg"), ProductController.addProduct);
routeProduct.post("/getproductbyid", ProductController.prefillProductInfo);
routeProduct.get("/getproduct", ProductController.getProduct);
routeProduct.post("/deleteproduct", ProductController.deleteProduct);
routeProduct.post("/updateproduct",ProductController.updateProductInfo)


module.exports = routeProduct;