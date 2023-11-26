const express = require('express');
const router = express.Router();
const products = require('../Middlewares/uploadImages.js');
const verifyRoles = require('../Middlewares/verifyRoles.js');
const product = require('../Controllers/productsCtrl.js');
const cloudinary = require('../Utils/cloudinary');


router.put("/:id", products.uploadPhotos.array('images', 10), products.productResizePhotos, product.uploadImages);
router.delete("/",  verifyRoles('2030'),  cloudinary.deleteOldImages);


module.exports = router;