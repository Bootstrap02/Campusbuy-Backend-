const express = require('express');
const router = express.Router();
const users = require('../Controllers/usersCtrl.js');

router.put('/:id', users.updatePassword);
router.post('/', users.forgotPassword);




module.exports = router;