const express = require('express');
const router = express.Router();
const premiumServices = require('../Controllers/productsCtrl.js');


router.put("/:productId", premiumServices.updatePremiumServices);


module.exports = router;