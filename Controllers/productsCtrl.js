const Product = require('../Models/productsModel');
const asyncHandler = require('express-async-handler');
const User = require('../Models/usersModel');
const slugify = require('slugify');
const {uploadImage, deleteImage} = require('../Utils/cloudinary');
const fs = require('fs');

const createProduct = asyncHandler(
    async(req, res) => {
        const {address, mobile} = req.user;
        console.log(req.user)
        try{
            if(req.body.title) {
                req.body.slug = slugify(req.body.title, {lower: true});
            }
            if (!req.body.sold){
                req.body.sold = 0;
            }
            if (!req.body.address){
                req.body.address = address;
            }
            if (!req.body.mobile){
                req.body.mobile = mobile;
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
                if (req.body.address) product.address = req.body.address;
                if (req.body.mobile) product.mobile = req.body.mobile;
    
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


    const addPremiumServices = asyncHandler(async (req, res) => {
        const productId = req.params.id;
      
        try {
          if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true });
          }
          
          let product = await Product.findOne({ _id: productId }).exec();
          
          if (!product) {
            return res.status(404).json({ error: 'Product not found!' });
          }
      
          // Toggle premiumServices
          product.premiumServices = !product.premiumServices;
      
          // Save the updated product
          await product.save();
      
          return res.status(200).json({ product, message: 'Premium service updated' });
      
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      });
      
      const updatePremiumServices = asyncHandler(async () => {
        const productId = req.params.id;
        try {
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
      
          // Find and update one product where premiumServices is true and updatedAt is older than 30 days
          const result = await Product.findByIdAndUpdate({ _id: productId },
            {
              premiumServices: true,
              updatedAt: { $lte: thirtyDaysAgo },
            },
            { $set: { premiumServices: false } }
          );
      
          if (result) {
            console.log('Product updated');
          } else {
            console.log('No product found to update');
          }
      
        } catch (error) {
          console.error('Error updating premiumServices:', error);
        }
      });
      
      // Set up interval to run the update function every day
      setInterval(updatePremiumServices, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    

    const requestCallback = asyncHandler(
        async (req, res) => {
            const { productId, phone } = req.body;
            const { _id, firstname, lastname, mobile } = req.user;
            const newMobile = phone || mobile;
            try {
                let user = await User.findById(_id);
    
                // Check if the user has already requested a callback for the product
                const alreadyCalledback = user.callback.find((callbackItem) => callbackItem._id.toString() === productId);
    
                if (alreadyCalledback) {
                    // If already requested, remove the callback from the array
                    user = await User.findByIdAndUpdate(_id, {
                        $pull: { callback: { _id: productId } },
                    }, { new: true });
    
                    res.status(200).json({ user, message: 'Callback request unsent successfully!' });
                } else {
                    // If not requested, add the callback to the array
                    user = await User.findByIdAndUpdate(_id, {
                        $push: {
                            callback: {
                                _id: productId,
                                firstname: firstname,
                                lastname: lastname,
                                mobile: newMobile,
                            }
                        },
                    }, { new: true });
    
                    await user.save();
                    res.status(201).json({ user, message: 'Callback request sent successfully!' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
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


    
    const uploadImages = asyncHandler(
        async( req, res ) => {
            const {id} = req.params;
            try{
            const uploader = async (path) => await uploadImage(path, "images");
            
                const urls = [];
                const files = req.files;
                console.log(files)
                for (const file of files)
                 {
                    const {path} = file;
                    const newPath = await uploader(path);
                    console.log(path)
                    urls.push(newPath);
                    fs.unlinkSync(path);
                }
                const findProduct = await Product.findByIdAndUpdate(id, {
            
                        images: urls.map((file) => {return  file})
                
                },
                 { new: true });
                res.status(201).json({ findProduct, message: 'Images uploaded successfully' });
            

            }catch (error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error'});
            }
        }
    );

    const deleteImages = asyncHandler(async (req, res) => {
        const { public_id } = req.params;
        const { id } = req.body;
    
        try {
            // Find the product by its ID
            const findProduct = await Product.findOne({ _id: id });
    
            if (!findProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Remove the specified image ID from the images array
            findProduct.images = findProduct.images.filter((image) => image.public_id !== public_id);
    
            // Save the updated product
            const updatedProduct = await findProduct.save();
    
            // Delete the image from storage
            await deleteImage(public_id, "images");
    
            res.status(201).json({ updatedProduct, message: 'Image deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    



        module.exports = { 
            createProduct,
             getAProduct, 
             getProducts,
              updateAProduct, 
              deleteAProduct, 
              addToWishlist, 
              addPremiumServices, 
              updatePremiumServices, 
              rating, 
              uploadImages,
              deleteImages,
              requestCallback 
        };