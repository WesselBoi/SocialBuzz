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
      content: req.body?.content || "",
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

async function handleLikeAndUnlikePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.userId;
    const isLiked = post.likes.includes(userId);

    if (!isLiked) {
      post.likes.push(userId); //Like
    } else {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      ); //Unlike
    }
    await post.save();

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
    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "username"
    );

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("userId", "username") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); 

    const totalPosts = await Post.countDocuments();
    const hasMore = skip + posts.length < totalPosts;

    res.json({
      posts,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
          path: "userId",
          select: "username",
        },
      });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  handleCreatePost,
  handleLikeAndUnlikePost,
  handleCommentOnPost,
  handleGetAllPosts,
  handleGetPostById,
};
