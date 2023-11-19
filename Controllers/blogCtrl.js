const Blog = require('../Models/blogModel');
const User = require('../Models/usersModel');
const asyncHandler = require('express-async-handler');


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
        const blog = await Blog.findOne({ _id: blogId }).populate(likes).populate(dislikes);

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
            const blogs = await Blog.find({}).exec().populate(likes).populate(dislikes);
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
            const blogId = req.body.id;
            // Find the blog you want to be liked
            const blog = await Blog.findOne({ _id: blogId });
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
            const blogId = req.body.id;
            // Find the blog you want to be liked
            const blog = await Blog.findOne({ _id: blogId });
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
    
   

module.exports = { createBlog, updateBlog, getABlog, getBlogs, deleteBlog, likeBlog, dislikeBlog }