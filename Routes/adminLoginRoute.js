const express = require('express');
const router = express.Router();
const users = require('../Controllers/usersCtrl.js')

router.post('/', users.adminLogin);
router.get('/', users.adminLogout);

module.exports = router;