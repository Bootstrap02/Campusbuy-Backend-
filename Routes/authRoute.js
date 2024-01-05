const express = require('express');
const router = express.Router();
const users = require('../Controllers/usersCtrl.js');

router.post('/', users.createUser);
router.get('/',  users.getAllUsers);
router.put('/:id', users.updateAUser);
router.put('/:id', users.updatePassword);
router.delete('/:id', users.deleteAUser);
router.get('/:id',  users.getAUser);



module.exports = router;