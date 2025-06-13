const User = require("../models/user");
const auth = require("../middlewares/auth");

async function handleGetAllUsers(req, res) {
  try {
    const { username } = req.query;
    let query = {};
    if (username) {
      query.username = { $regex: username, $options: "i" };
    }
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function handleGetUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleFollowUser(req, res) {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.userId);

    if (!userToFollow || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isAlreadyFollowing = currentUser.following.some(
      (id) => id.toString() === req.params.id.toString()
    );

    if (!isAlreadyFollowing) {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.userId);
      await currentUser.save();
      await userToFollow.save();
    }

    const updatedUser = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");

    res.json({ user: updatedUser, message: "Followed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleUnfollowUser(req, res) {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.userId);

    if (!userToUnfollow || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === req.params.id.toString()
    );

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id.toString()
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      await currentUser.save();
      await userToUnfollow.save();
    }

    const updatedUser = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");

    res.json({ user: updatedUser, message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUser,
  handleFollowUser,
  handleUnfollowUser,
};
