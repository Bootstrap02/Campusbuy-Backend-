const express = require('express');
const router = express.Router();
const callback = require('../Controllers/productsCtrl.js');


router.put("/", callback.requestCallback);


module.exports = router;