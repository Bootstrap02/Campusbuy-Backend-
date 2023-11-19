const express = require('express');
const router = express.Router();
const users = require('../Controllers/usersCtrl.js')

router.post('/', users.loginUser);
router.get('/', users.logoutAUser);

module.exports = router;