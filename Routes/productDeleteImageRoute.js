const express = require('express');
const router = express.Router();
const product = require('../Controllers/productsCtrl.js');


router.delete("/:public_id",  product.deleteImages);


module.exports = router;