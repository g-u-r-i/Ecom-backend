const pettyController = require('../controller/pettyController');
const routePetty = require("express").Router();


routePetty.post("/add", pettyController.add);
routePetty.post("/prefill-petty-info", pettyController.prefillPettyInfo);
routePetty.post("/get-list", pettyController.getList);
routePetty.post("/search-date", pettyController.searchDate);
routePetty.post("/update", pettyController.update);
routePetty.post("/delete", pettyController.deletePetty);


module.exports = routePetty;
