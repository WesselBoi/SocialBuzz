const express = require('express');
const auth = require('../middlewares/auth');
const { handleGetUser , handleFollowUser , handleUnfollowUser , handleGetAllUsers } = require('../controllers/users');
const router = express.Router();


//get user 
router.get('/:id', handleGetUser);

//get all users
router.get('/' , handleGetAllUsers)

//follow a user
router.post('/follow/:id', auth, handleFollowUser);

//unfollow a user
router.post('/unfollow/:id', auth, handleUnfollowUser );


module.exports = router;