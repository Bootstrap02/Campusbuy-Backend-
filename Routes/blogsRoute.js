const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const blogs = require('../Controllers/blogCtrl.js');

router.post('/',  verifyRoles('2030'), blogs.createBlog);
router.put('/:id',  verifyRoles('2030'), blogs.updateBlog);
router.put('/', blogs.likeBlog);
router.get('/:id', blogs.getABlog);
router.get('/', blogs.getBlogs);
router.delete('/:id',  verifyRoles('2030'), blogs.deleteBlog);


module.exports = router;