const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const products = require('../Controllers/productsCtrl.js');

router.post("/", products.createProduct);
router.get("/:id", products.getAProduct);
router.get("/", products.getProducts);
router.put("/:id", products.updateAProduct);
router.put("/",  products.addToWishlist);
router.delete("/:id", verifyRoles('2030'), products.deleteAProduct);


module.exports = router;