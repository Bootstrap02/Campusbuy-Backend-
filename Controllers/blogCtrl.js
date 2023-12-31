const Blog = require('../Models/blogModel');
const User = require('../Models/usersModel');
const asyncHandler = require('express-async-handler');
const { uploadImage, deleteImage} = require('../Utils/cloudinary');
const fs = require('fs');


const createBlog = asyncHandler(
    async (req, res) => {
    try{
        const { title, description, category, image, numviews, author } = req.body;
const oldBlog = await Blog.findOne({ title }).exec();
if (oldBlog) {res.status(400).json({ message: 'Blog already exists' }); return; }
    const newBlog = await Blog.create({
        title: title,
        description: description,
        category: category,
        image: image,
        numviews: numviews,
        author: author,
}); 

res.status(201).json(newBlog);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});


const updateBlog = asyncHandler(
    async (req, res) => {
    try{
        const {id} = req.params;
        const { title, description, category, image, numviews, author } = req.body;
        const findBlog = await Blog.findOne({_id: id}).exec();
        if(!findBlog) {res.status(400).json({ message: 'Blog does not exist' }); return; 
    }else{
        if(title){findBlog.title = title};
        if(description){findBlog.description = description};
        if(category){findBlog.category = category};
        if(image){findBlog.image = image};
        if(numviews){findBlog.numviews = numviews};
        if(author){findBlog.author = author};
    };
    const updatedBlog = await findBlog.save(); 
    res.status(201).json(updatedBlog);

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});



const getABlog = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findOne({ _id: blogId }).populate('likes').populate('dislikes').exec();

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found!' });
        } else {
            // Update the numviews field using $inc
            blog.numviews += 1;
            await blog.save();

            // Respond with the updated blog
            return res.status(200).json(blog);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getBlogs = asyncHandler( 
    async(req, res) => {
        try {
            const blogs = await Blog.find({}).populate('likes').populate('dislikes').exec();
          if (blogs.length === 0) {
            res.status(400).json({ success: false, error: 'No blogs found!' });
          } else {
            res.status(200).json({ success: true, data: blogs });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        
    }
    );

    const deleteBlog = asyncHandler(
        async(req, res) => {
            try{
                const {id} = req.params;
                const findBlog = await Blog.findOne({_id: id}).exec();
                if(!findBlog) {res.status(400).json({ message: 'Blog does not exist' }); return; 
            }else{
                await findBlog.deleteOne({ _id: id});
                res.status(201).json({success: true, message: 'Blog deleted successfully'});
            }                
            }catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Internal Server Error' });
              }
        }
    );

    
    const likeBlog = asyncHandler(async (req, res) => {
        try {
            const {_id} = req.body;
            // Find the blog you want to be liked
            const blog = await Blog.findOne({ _id: _id });
            console.log('Found Blog:', blog);
            // Find the logged-in user liking the blog
            const loginUser = req?.user?._id;
            console.log('Login User:', loginUser);
            // Find if the blog is already liked by the user
            const isLiked = blog?.isLiked;
            console.log('Is Liked:', isLiked);
            // Find if the blog is already disliked by the user
            const alreadyDisliked = blog?.dislikes?.find((userId) => userId.toString() === loginUser?.toString());
            console.log('Already Disliked:', alreadyDisliked);


            // If the blog is already disliked by the user, remove the user from the dislikes array
            if (alreadyDisliked) {
                const updatedBlog = await Blog.findByIdAndUpdate(
                    _id,
                    {
                        $pull: { dislikes: loginUser },
                        isDisliked: false,
                    },
                    { new: true }
                );
                return res.json(updatedBlog);
            }
    
            if (isLiked) {
                // If the blog is already liked, remove the user from the likes array
                const updatedBlog = await Blog.findByIdAndUpdate(
                    _id,
                    {
                        $pull: { likes: loginUser },
                        isLiked: false,
                    },
                    { new: true }
                );
                return res.json(updatedBlog);
            } else {
                // If the blog is not liked, add the user to the likes array
                const updatedBlog = await Blog.findByIdAndUpdate(
                    _id,
                    {
                        $push: { likes: loginUser },
                        isLiked: true,
                    },
                    { new: true }
                );
                return res.json(updatedBlog);
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    const dislikeBlog = asyncHandler(async (req, res) => {
        try {
            const {_id} = req.body;
            // Find the blog you want to be disliked
            const blog = await Blog.findOne({ _id: _id });
            console.log('Found Blog:', blog);
            // Find the logged-in user liking the blog
            const loginUser = req?.user?._id;
            console.log('Login User:', loginUser);
            // Find if the blog is already liked by the user
            const isDisliked = blog?.isDisliked;
            console.log('Is Disliked:', isDisliked);
            // Find if the blog is already disliked by the user
            const alreadyLiked = blog?.likes?.find((userId) => userId.toString() === loginUser?.toString());
            console.log('Already Liked:', alreadyLiked);


            // If the blog is already disliked by the user, remove the user from the dislikes array
            if (alreadyLiked) {
                const updatedBlog = await Blog.findByIdAndUpdate(
                    _id,
                    {
                        $pull: { likes: loginUser },
                        isLiked: false,
                    },
                    { new: true }
                );
                return res.json(updatedBlog);
            }
    
            if (isDisliked) {
                // If the blog is already liked, remove the user from the likes array
                const updatedBlog = await Blog.findByIdAndUpdate(
                    _id,
                    {
                        $pull: { dislikes: loginUser },
                        isDisliked: false,
                    },
                    { new: true }
                );
                return res.json(updatedBlog);
            } else {
                // If the blog is not liked, add the user to the likes array
                const updatedBlog = await Blog.findByIdAndUpdate(
                    _id,
                    {
                        $push: { dislikes: loginUser },
                        isDisliked: true,
                    },
                    { new: true }
                );
                return res.json(updatedBlog);
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });


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
                const findBlog = await Blog.findByIdAndUpdate(id, {
            
                        images: urls.map((file) => {return  file})
                
                },
                 { new: true });
                res.status(201).json({ findBlog, message: 'Images uploaded successfully' });
            

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
            const findBlog = await Blog.findOne({ _id: id });
    
            if (!findBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
    
            // Remove the specified image ID from the images array
            findBlog.images = findBlog.images.filter((image) => image.public_id !== public_id);
    
            // Save the updated product
            const updatedBlog = await findBlog.save();
    
            // Delete the image from storage
            await deleteImage(public_id, "images");
    
            res.status(201).json({ updatedBlog, message: 'Image deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    
   

module.exports = { createBlog, updateBlog, getABlog, getBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages, deleteImages }