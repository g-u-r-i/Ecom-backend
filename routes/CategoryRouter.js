const categoryController = require('../controller/categoryController');
const routeCategory = require("express").Router();


routeCategory.post("/add", categoryController.addCategory);
routeCategory.post("/getcategorybyid", categoryController.prefillCategoryInfo);
routeCategory.get("/getcategory", categoryController.getCategory);
routeCategory.post("/deletecategory", categoryController.deleteCategory);
routeCategory.post("/updatecategory",categoryController.updateCategoryInfo)


module.exports = routeCategory;