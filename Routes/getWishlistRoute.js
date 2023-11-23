const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const wishlist = require('../Controllers/usersCtrl.js');

// router.post("/", products.createProduct);
// router.get("/:id", products.getAProduct);
router.get("/", wishlist.getWishlist);
// router.put("/:id", products.updateAProduct);
// router.put("/",  products.addToWishlist);
// router.delete("/:id", verifyRoles('2030'), products.deleteAProduct);


module.exports = router;