const roleController = require('../controller/roleController');
const routeRole = require("express").Router();


routeRole.get("/get-roles", roleController.getRoles);
routeRole.post("/delete", roleController.deleteRole);
routeRole.post("/prefill-role-info", roleController.prefillRoleInfo);
routeRole.post("/update", roleController.updateRole);
routeRole.post("/get-roles", roleController.getRolesByPost);
routeRole.post("/get-roles-and-permissions", roleController.getRolesAndPermission);
routeRole.post("/set-permissions", roleController.setPermissions);
routeRole.post("/add", roleController.addRole);


module.exports = routeRole;
