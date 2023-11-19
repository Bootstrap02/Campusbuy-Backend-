const express = require('express');
const router = express.Router();
const blogs = require('../Controllers/blogCtrl.js');


router.put('/', blogs.dislikeBlog);


module.exports = router;