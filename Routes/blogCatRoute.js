const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const category = require('../Controllers/blogCatCtrl.js');

 router.post('/', verifyRoles('2030'), category.createCategory);
 router.get('/',  category.getCategories);
 router.put('/:title', verifyRoles('2030'), category.updateCategory);
 router.delete('/:title', verifyRoles('2030'), category.deleteCategory);
 router.get('/:title',  category.getCategory);



module.exports = router;