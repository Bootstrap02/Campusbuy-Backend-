const express = require('express');
const app = express();
const { notFound, errorHandler } = require('./Middlewares/errorHandler');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const dbConnect = require('./Config/dbConnect');
const verifyJwt = require('./Middlewares/verifyJwt');
const verifyRefreshToken = require('./Middlewares/verifyRefreshToken');
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions= require('./Config/corsOptions');

dbConnect();



// Body parsing middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse Cookie requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(morgan('dev'));

app.use(cors(corsOptions));

app.use('/login', require('./Routes/loginRoute'));
app.use('/logout', require('./Routes/loginRoute'));
app.use('/adminlogin', require('./Routes/adminLoginRoute'));
app.use('/adminlogout', require('./Routes/adminLoginRoute'));
app.use('/createuser', require('./Routes/authRoute'));
app.use('/getrefreshtoken', require('./Routes/refreshToken'));
app.use('/updatepassword', require('./Routes/updatePasswordRoute'));
app.use('/forgotpassword', require('./Routes/updatePasswordRoute'));
app.use('/resetpassword', require('./Routes/resetPasswordRoute'));
app.use('/getuniversities', require('./Routes/universityRoute'));
app.use('/getuniversity', require('./Routes/universityRoute'));
app.use('/getproduct', require('./Routes/productsRoute'));
app.use('/getproducts', require('./Routes/productsRoute'));
app.use('/getcategories', require('./Routes/productsCategoryRoute'));
app.use('/updatepremiumservices', require('./Routes/premiumServicesTimeoutRoute'));

app.use(verifyJwt);
app.use('/getusers', require('./Routes/authRoute'));
app.use('/updateuser', require('./Routes/authRoute'));
app.use('/deleteuser', require('./Routes/authRoute'));
app.use('/getuser', require('./Routes/authRoute'));
app.use('/getwishlist', require('./Routes/getWishlistRoute'));


app.use('/createuniversity', require('./Routes/universityRoute'));
app.use('/updateuniversity', require('./Routes/universityRoute'));
app.use('/deleteuniversity', require('./Routes/universityRoute'));


app.use('/addpremiumservices', require('./Routes/premiumServicesRoute'));
app.use('/createproduct', require('./Routes/productsRoute'));

app.use('/updateproduct', require('./Routes/productsRoute'));
app.use('/deleteproduct', require('./Routes/productsRoute'));
app.use('/addwishlist', require('./Routes/productsRoute'));
app.use('/rateproduct', require('./Routes/productsCategoryRoute'));
app.use('/uploadproductimage', require('./Routes/productImagesRoute'));
app.use('/deleteproductimage', require('./Routes/productDeleteImageRoute'));
app.use('/requestcallback', require('./Routes/callbackRequestRoute'));
app.use('/deleteoldimages', require('./Routes/productImagesRoute'));

app.use('/createblog', require('./Routes/blogsRoute'));
app.use('/updateblog', require('./Routes/blogsRoute'));
app.use('/getablog', require('./Routes/blogsRoute'));
app.use('/getblogs', require('./Routes/blogsRoute'));
app.use('/deleteblog', require('./Routes/blogsRoute'));
app.use('/likeblog', require('./Routes/blogsRoute'));
app.use('/dislikeblog', require('./Routes/dislikedBlogsRoute'));
app.use('/uploadblogimage', require('./Routes/blogImagesRoute'));
app.use('/deleteblogimage', require('./Routes/blogImagesRoute'));

app.use('/createcategory', require('./Routes/productsCategoryRoute'));
app.use('/getcategory', require('./Routes/productsCategoryRoute'));
app.use('/updatecategory', require('./Routes/productsCategoryRoute'));
app.use('/deletecategory', require('./Routes/productsCategoryRoute'));

app.use('/createblogcategory', require('./Routes/blogCatRoute'));
app.use('/getblogcategories', require('./Routes/blogCatRoute'));
app.use('/getblogcategory', require('./Routes/blogCatRoute'));
app.use('/updateblogcategory', require('./Routes/blogCatRoute'));
app.use('/deleteblogcategory', require('./Routes/blogCatRoute'));

app.use('/createbrand', require('./Routes/brandRoute'));
app.use('/getbrands', require('./Routes/brandRoute'));
app.use('/getbrand', require('./Routes/brandRoute'));
app.use('/updatebrand', require('./Routes/brandRoute'));
app.use('/deletebrand', require('./Routes/brandRoute'));

app.use('/createcoupon', require('./Routes/couponRoute'));
app.use('/getcoupons', require('./Routes/couponRoute'));
app.use('/getcoupon', require('./Routes/couponRoute'));
app.use('/updatecoupon', require('./Routes/couponRoute'));
app.use('/deletecoupon', require('./Routes/couponRoute'));



app.use(notFound);
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on Port ${PORT}`);
    });
});
