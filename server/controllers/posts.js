const Post = require("../models/post");
const Comment = require("../models/comment");
const { cloudinary } = require("../config/cloudinary");

async function handleCreatePost(req, res) {
  // Check if content exists or if there's a file (allowing image-only posts)
  if (!req.body?.content && !req.file) {
    return res.status(400).json({ error: "Content or image is required" });
  }
  try {
    const postData = {
      userId: req.user.userId,
      content: req.body?.content || "", // Use optional chaining here
    };

    if (req.file) {
      postData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const post = await Post.create(postData);
    const populatedPost = await Post.findById(post._id)
      .populate("userId", "username")
      .populate("comments");

    res.status(201).json(populatedPost);
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
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

    // Populate userId with username
    const populatedComment = await Comment.findById(comment._id)
    .populate("userId", "username");

    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleGetAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("userId", "username") 
      .populate("comments") // replaces comments with the Comment model
      .sort({ createdAt: -1 }); 
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
      .populate({
        path: "comments",
        populate: {
          path: "userId", select: "username"
        }
      })
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
