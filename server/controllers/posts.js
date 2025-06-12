const Post = require("../models/post");
const Comment = require("../models/comment");

async function handleCreatePost(req, res) {
  if (!req.body.content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const post = await Post.create({
      userId: req.user.userId,
      content: req.body.content,
    });
    const populatedPost = await Post.findById(post._id)
      .populate("userId", "username")
      .populate("comments");
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleLikePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.likes.includes(req.user.userId)) {
      post.likes.push(req.user.userId);
      await post.save();
    }

    const updatedPost = await Post.findById(req.params.id)
      .populate("userId", "username")
      .populate("comments");

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleCommentOnPost(req, res) {
  try {
    const comment = await Comment.create({
      postId: req.params.id,
      userId: req.user.userId,
      content: req.body.content,
    });

    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleGetAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("userId", "username") // replaces userId with the username field from the User model
      .populate("comments") // replaces comments with the Comment model
      .sort({ createdAt: -1 }); // sorts posts by creation date in descending order
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleGetPostById(req, res) {
  if (!req.params.id) {
    return res.status(400).json({ error: "Post ID is required" });
  }
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "username")
      .populate("comments"); 
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  handleCreatePost,
  handleLikePost,
  handleCommentOnPost,
  handleGetAllPosts,
  handleGetPostById,
};
