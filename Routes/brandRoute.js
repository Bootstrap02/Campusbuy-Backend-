const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const brand = require('../Controllers/brandCtrl.js');

 router.post('/', verifyRoles('2030'), brand.createBrand);
 router.get('/',  brand.getBrands);
 router.put('/:title', verifyRoles('2030'), brand.updateBrand);
 router.delete('/:title', verifyRoles('2030'), brand.deleteBrand);
 router.get('/:title',  brand.getBrand);



module.exports = router;