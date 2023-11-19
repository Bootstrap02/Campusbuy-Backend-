const express = require('express');
const router = express.Router();
const verifyRefreshToken = require('../Middlewares/verifyRefreshToken');

router.get('/', verifyRefreshToken, (req, res) => {
    // Access user information set in the request by verifyRefreshToken middleware
    const user = req.user;
    res.json(user);
});

module.exports = router;
