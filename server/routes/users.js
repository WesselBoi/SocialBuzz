const express = require('express');
const auth = require('../middlewares/auth');
const { handleGetUser , handleFollowUser } = require('../controllers/users');
const router = express.Router();


//get user 
router.get('/:id', handleGetUser);

//follow a user
router.post('/follow/:id', auth, handleFollowUser);

module.exports = router;