const Brand = require('../Models/brandModel');
const asyncHandler = require('express-async-handler');

const createBrand = asyncHandler(
    async( req, res) =>{
        const {title} = req.body;
        try{
            const oldBrand = await Brand.findOne({title: title})
            if(oldBrand) {
                return res.status(400).json('Brand already exists!')
            }
            const brand = await Brand.create(req.body)
            res.status(200).json(brand)
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);


const getBrands = asyncHandler(async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.status(200).json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


const getBrand = asyncHandler(async (req, res) => {
    const { title } = req.params;
    try {
        const brand = await Brand.findOne({ title: new RegExp(title, 'i') });

        if (!brand) {
            return res.status(400).json('Brand does not exist!');
        }

        res.status(200).json(brand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const updateBrand = asyncHandler(
    async( req, res) =>{
        const {title} = req.params
        try{
            const brand = await Brand.findOne({title: title})
            if(!brand) {
                return res.status(400).json('Brand does not exist!')
            }
            const updatedBrand = await Brand.findOneAndUpdate({title: title}, req.body, {new: true})
            res.status(200).json(updatedBrand)
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);

const deleteBrand = asyncHandler(
    async( req, res) =>{
        const {title} = req.params
        try{
            const brand = await Brand.findOne({title: title})
            if(!brand) {
                return res.status(400).json('Brand does not exist!')
            }
            await Brand.findOneAndDelete({title: title})
            res.status(200).json('Brand deleted successfully!')
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);



module.exports = { createBrand, getBrands, getBrand, updateBrand, deleteBrand}