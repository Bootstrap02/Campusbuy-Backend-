const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const coupon = require('../Controllers/couponCtrl.js');

router.post('/',  verifyRoles('2030'), coupon.createCoupon);
router.get('/', coupon.getCoupons);
router.get('/:id', coupon.getCoupon);
router.put('/:id',  verifyRoles('2030'), coupon.updateCoupon);
router.delete('/:id',  verifyRoles('2030'), coupon.deleteCoupon);




module.exports = router;