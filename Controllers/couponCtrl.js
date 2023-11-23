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

const getCoupons = asyncHandler(
    async( req, res) =>{
        const {name} = req.body;
        try{
                const coupons = await Coupon.find({}).exec();
              if (coupons.length === 0) {
                res.status(400).json({ success: false, error: 'No coupons found!' });
              } else {
                res.status(200).json({ success: true, data: coupons });
              }
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);

const getCoupon = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const coupon = await Coupon.findOne({ _id: id });

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found!' });
        } else {
            return res.status(200).json(coupon);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


const deleteCoupon = asyncHandler(
    async(req, res) => {
        try{
            const {id} = req.params;
            const findCoupon = await Coupon.findOne({_id: id}).exec();
            if(!findCoupon) {res.status(400).json({ message: 'Coupon does not exist' }); return; 
        }else{
            await findCoupon.deleteOne({ _id: id});
            res.status(201).json({success: true, message: 'Coupon deleted successfully'});
        }                
        }catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
          }
    }
);


const updateCoupon = asyncHandler(
    async (req, res) => {
    try{
        const {id} = req.params;
        const { name, expiry, discount } = req.body;
        const findCoupon = await Coupon.findOne({_id: id}).exec();
        if(!findCoupon) {res.status(400).json({ message: 'Coupon does not exist' }); return; 
    }else{
        if(name){findCoupon.name = name};
        if(expiry){findCoupon.expiry = expiry};
        if(discount){findCoupon.discount = discount};

    };
    const updatedCoupon = await findCoupon.save(); 
    res.status(201).json(updatedCoupon);

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});




module.exports = { createCoupon, getCoupons, getCoupon, deleteCoupon, updateCoupon };