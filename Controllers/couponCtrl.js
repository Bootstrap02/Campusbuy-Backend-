const Coupon = require('../Models/couponModel');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(
    async( req, res) =>{
        const {name} = req.body;
        try{
            const oldCoupon = await Coupon.findOne({name: name})
            if(oldCoupon) {
                return res.status(400).json('Coupon already exists!')
            }
            const coupon = await Coupon.create(req.body)
            res.status(200).json(coupon)
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);


module.exports = { createCoupon, };