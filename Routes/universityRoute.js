const express = require('express');
const router = express.Router();
const verifyRoles = require('../Middlewares/verifyRoles.js');
const universities = require('../Controllers/universitiesCtrl.js');

router.post('/',  verifyRoles('2030'), universities.createUniversity);
router.put('/:id',  verifyRoles('2030'), universities.updateUniversity);
router.get('/:id', universities.getUniversity);
router.get('/', universities.getUniversities);
router.delete('/:id',  verifyRoles('2030'), universities.deleteUniversity);


module.exports = router;