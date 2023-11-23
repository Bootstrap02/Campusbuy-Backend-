const express = require('express');
const router = express.Router();
const products = require('../Middlewares/uploadImages.js');
const product = require('../Controllers/productsCtrl.js');


router.put("/:id", products.uploadPhotos.array('images', 10), products.productResizePhotos, product.uploadImages);
router.put("/:id",  product.deleteImages);


module.exports = router;