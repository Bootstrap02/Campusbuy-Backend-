const Category = require('../Models/blogCatModel');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(
    async( req, res) =>{
        const {title} = req.body;
        try{
            const oldCategory = await Category.findOne({title: title})
            if(oldCategory) {
                return res.status(400).json('Category already exists!')
            }
            const category = await Category.create(req.body)
            res.status(200).json(category)
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);


const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


const getCategory = asyncHandler(async (req, res) => {
    const { title } = req.params;
    try {
        const category = await Category.findOne({ title: new RegExp(title, 'i') });

        if (!category) {
            return res.status(400).json('Category does not exist!');
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const updateCategory = asyncHandler(
    async( req, res) =>{
        const {title} = req.params
        try{
            const category = await Category.findOne({title: title})
            if(!category) {
                return res.status(400).json('Category does not exist!')
            }
            const updatedCategory = await Category.findOneAndUpdate({title: title}, req.body, {new: true})
            res.status(200).json(updatedCategory)
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);

const deleteCategory = asyncHandler(
    async( req, res) =>{
        const {title} = req.params
        try{
            const category = await Category.findOne({title: title})
            if(!category) {
                return res.status(400).json('Category does not exist!')
            }
            await Category.findOneAndDelete({title: title})
            res.status(200).json('Category deleted successfully!')
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
);



module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory}