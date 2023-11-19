const Product = require('../Models/productsModel');
const asyncHandler = require('express-async-handler');
const User = require('../Models/usersModel');
const slugify = require('slugify');

const createProduct = asyncHandler(
    async(req, res) => {
        try{
            if(req.body.title) {
                req.body.slug = slugify(req.body.title, {lower: true});
            }
            if (!req.body.sold){
                req.body.sold = 0;
            }
            const newProduct = await Product.create(req.body);
            return res.status(201).json(newProduct);

        }catch (error){
        if(error)   {
            throw new Error(error)
        }
        }
    }
);


const getAProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // Validate productId (you can use a validation library for more robust validation)
    if (!productId) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ error: 'Product not found!' });
        } else {
            return res.status(200).json(product);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getProducts = asyncHandler( 
    async(req, res) => {
        

        try {

            //filtering products

            const queryObj = { ...req.query };
            const excludeFields = ['page', 'sort', 'limit', 'fields'];
            excludeFields.forEach(el => delete queryObj[el]);
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

          let query = Product.find(JSON.parse(queryStr));
        
          console.log(queryObj, req.query)

          //sorting products
          if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
            }else{
                query = query.sort('-createdAt');
            }


            //liiting the fields

            if(req.query.fields) {
                const fields = req.query.fields.split(",").join(" ");
                query = query.select(fields);
            }else{
                query = query.select('-__v');
            }


            //pagination

            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 10;
            const skip = (page - 1) * limit;
            console.log(page, limit, skip);
            query = query.skip(skip).limit(limit);
            if(req.query.page) {
                const numProducts = await Product.countDocuments();
                if(skip >= numProducts) {throw new Error('This page does not exist')};
            }


            const products = await query;
          if (products.length === 0) {
            res.status(404).json({ success: false, error: 'No products found!' });
          } else {
            res.status(200).json({ success: true, data: products });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        
    }
    );





    const updateAProduct = asyncHandler(async (req, res) => {
        const productId = req.params.id;
    
        try {
            if(req.body.title) {
                req.body.slug = slugify(req.body.title, {lower: true});
            }
            const product = await Product.findOne({ _id: productId }).exec();
            if (!product) {
                res.status(404).json({ error: 'Product not found!' });
            } else {
                // Update product properties based on request body
                if (req.body.title) product.title = req.body.title;
                if (req.body.slug) product.slug = req.body.slug;
                if (req.body.price) product.price = req.body.price;
                if (req.body.description) product.description = req.body.description;
                if (req.body.category) product.category = req.body.category;
                if (req.body.brand) product.brand = req.body.brand;
                if (req.body.quantity) product.quantity = req.body.quantity;
                if (req.body.images) product.images = req.body.images;
                if (req.body.sold) product.sold = req.body.sold;
                if (req.body.color) product.color = req.body.color;
                if (req.body.ratings) product.ratings = req.body.ratings;
    
                const newProduct = await product.save();
                res.status(200).json(newProduct);
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    

    const deleteAProduct = asyncHandler(
        async (req, res) => {
            const goods = req.params; // Retrieve the product's ID from the request body
            const product= await Product.findOne({ _id: goods.id }).exec(); // Use _id instead of id
    
            if (!product) {
                res.status(404).json({ message: 'Product not found' });
              
            } else {
                 // Check if the product making the request has the "admin" role
              
                try {
                    await product.deleteOne({ _id: product.id });
                    res.status(200).json({ message: `Product: ${product.title}  deleted successfully.` });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Internal Server Error' });
                }
            }
        }
    );


    const addToWishlist = asyncHandler(
        async( req, res ) => {
        const { productId } = req.body;
        const {_id} = req.user;
        try{
         let user = await User.findById(_id);
        
            // if(!user) {res.status(400).json({ message: 'User does not exist' }); return};
            const alreadyAdded =  user.wishlist.find((_id) => _id.toString() === productId);
            
            if(alreadyAdded) {
                 user = await User.findByIdAndUpdate(_id, {
                    $pull: { wishlist: productId },
                }, { new: true });
                
                res.status(200).json(user);
            }else{
                user = await User.findByIdAndUpdate(_id, {
                    $push: { wishlist: productId },
                }, { new: true });
                
                await user.save();
                res.status(201).json({ user, message: 'Product added to Wishlist' });

            }
           

        }catch (error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error'});
        }

        }
    );

    const rating = asyncHandler(
        async( req, res ) => {
            const { productId, star, comment } = req.body;
            const {_id} = req.user;
            try{
                let product = await Product.findById(productId);

                const alreadyRated =  product.ratings.find(
                    (userId) => userId.toString() === _id.toString());
            
                if(alreadyRated) {
                     const updateRating = await Product.updateOne({
                        ratings: { $elemMatch: alreadyRated },
                    },
                    {
                        $set:{"ratings.$.star": star, "ratings.$.comment": comment}
                },
                 { new: true });
                    
                    
                }else{
                    const rateProduct = await Product.findByIdAndUpdate(productId, {
                        $push: { ratings:{
                            star: star,
                            comment : comment,
                            postedBy: _id
                        }}
                        }, { new: true });                
                
                    }
                
                const getAllRatings = await Product.findById(productId);
                let totalRatings = getAllRatings.ratings.length;
                let ratingSum = getAllRatings.ratings.map(
                    (item) => item.star).reduce((prev, curr) => prev + curr, 0);

                    let actualRating =Math.round(ratingSum / totalRatings);
                    const finalProduct = await Product.findByIdAndUpdate(productId, {
                        totalRating: actualRating
                    }, { new: true });

                    res.status(201).json({ finalProduct, message: 'Product rated successfully' });

            }catch (error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error'});
        }
        }
    );

module.exports = { createProduct, getAProduct, getProducts, updateAProduct, deleteAProduct, addToWishlist, rating };