const express = require('express');
const auth = require('../middlewares/auth');
const { handleCreatePost , handleLikeAndUnlikePost , handleCommentOnPost , handleGetAllPosts , handleGetPostById} = require('../controllers/posts');
const { upload } = require('../config/cloudinary');
const router = express.Router();


//Create a post
router.post('/', auth, upload.single('image'),  handleCreatePost);  //auth middleware checks if the user is authenticated

//Like or Unlike a post
router.post('/:id/like', auth, handleLikeAndUnlikePost);


//Comment on a post
router.post('/:id/comment', auth, handleCommentOnPost);  


//get all posts
router.get('/', handleGetAllPosts); // No auth middleware here, as we want to allow anyone to view posts

//get a post by id
router.get('/:id', handleGetPostById); // No auth middleware here, as we want to allow anyone to view posts

module.exports = router;