const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const coupon = require('../Controllers/couponCtrl.js');

router.post('/',  verifyRoles('2030'), coupon.createCoupon);
// router.get('/',  users.getAllUsers);
// router.put('/:id', users.updateAUser);
// router.put('/:id', users.updatePassword);
// router.delete('/:id', verifyRoles('2030'), users.deleteAUser);
// router.get('/:id',  users.getAUser);



module.exports = router;