const express = require('express');
const router = express.Router();
const users = require('../Controllers/usersCtrl.js');

router.put('/:token', users.resetPassword);




module.exports = router;