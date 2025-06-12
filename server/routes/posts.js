const express = require('express');
const auth = require('../middlewares/auth');
const { handleCreatePost , handleLikePost , handleCommentOnPost , handleGetAllPosts , handleGetPostById} = require('../controllers/posts');
const router = express.Router();


//Create a post
router.post('/', auth, handleCreatePost);  //auth middleware checks if the user is authenticated

//Like a post
router.post('/:id/like', auth, handleLikePost);


//Comment on a post
router.post('/:id/comment', auth, handleCommentOnPost);  


//get all posts
router.get('/', handleGetAllPosts); // No auth middleware here, as we want to allow anyone to view posts

//get a post by id
router.get('/:id', handleGetPostById); // No auth middleware here, as we want to allow anyone to view posts

module.exports = router;