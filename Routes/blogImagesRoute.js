const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const blogs = require('../Middlewares/uploadImages.js');
const blog = require('../Controllers/blogCtrl.js');



router.put("/:id", verifyRoles('2030'),  blogs.uploadPhotos.array('images', 10), blogs.blogResizePhotos, blog.uploadImages);


module.exports = router;