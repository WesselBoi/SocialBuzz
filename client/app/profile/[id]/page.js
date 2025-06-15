"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Heart, MessageCircle, User, Users, UserPlus, UserMinus, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState();
  const { id } = useParams();

  const currentUser = localStorage.getItem("userId")

  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setIsLoading(false);
    }

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/posts");
        setPosts(res.data.filter((post) => post.userId._id === id));
      } catch (error) {
        setError("Failed to fetch posts");
        console.error("Error fetching posts:", error);
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [id]);

  useEffect(() => {
    if (user && user.followers && localStorage.getItem("userId")) {
      setIsFollowing(
        user.followers.some(
          (follower) =>
            (typeof follower === "string"
              ? follower
              : follower._id?.toString()) === localStorage.getItem("userId")
        )
      );
    }
  }, [user]);

  async function handleFollow() {
    if (!user) return;

    if(!currentUser || currentUser === 'undefined'){
      setError("You must be logged in to follow")
      return
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/follow/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsFollowing(true);
      setUser((prev) => ({
        ...prev,
        followers: [...prev.followers, localStorage.getItem("userId")],
      }));
      setError(null);
    } catch (err) {
      console.log("Error : ", err);
      setError("Error following user");
    }
  }

  async function handleUnfollow() {
    if (!user) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/unfollow/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsFollowing(false);
      setUser((prev) => ({
        ...prev,
        followers: prev.followers.filter(
          (uid) => uid !== localStorage.getItem("userId")
        ),
      }));
      setError(null);
    } catch (err) {
      console.log("Error : ", err);
      setError("Error unfollowing user");
    }
  }

  const isOwnProfile = id === localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col md:flex-row">
      {/* Left padding for sidebar on desktop */}
      <div className="hidden md:block md:w-64 flex-shrink-0" />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 px-3 md:px-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="w-full max-w-2xl mb-8">
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Profile Avatar and Info */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                      {user?.username}
                    </h1>
                    {currentUser === user?._id && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{posts.length}</div>
                        <div className="text-gray-400">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{user?.followers?.length || 0}</div>
                        <div className="text-gray-400">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{user?.following?.length || 0}</div>
                        <div className="text-gray-400">Following</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow/Unfollow Button */}
                {!isOwnProfile && (
                  <div className="flex justify-center md:justify-start">
                    {isFollowing ? (
                      <button
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg cursor-pointer"
                        onClick={handleUnfollow}
                      >
                        <UserMinus size={18} />
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 cursor-pointer"
                        onClick={handleFollow}
                      >
                        <UserPlus size={18} />
                        Follow
                      </button>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Section */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-200">
                  Posts by {user?.username}
                </h2>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group hover:border-gray-600/50"
                    >
                      <Link href={`/posts/${post._id}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-200 text-lg">
                              {user?.username || "Unknown User"}
                            </h3>
                            <p className="text-gray-400 text-sm">Just now</p>
                          </div>
                        </div>
                        
                        {post.content && (
                          <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                            {post.content}
                          </p>
                        )}

                        {/* Post Image */}
                        {post.image?.url && (
                          <div className="mb-4 rounded-xl overflow-hidden">
                            <img
                              src={post.image.url}
                              alt="Post image"
                              className="w-full h-100 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Interaction Bar */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-700/50">
                          <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                            <Heart size={18} />
                            <span className="font-medium">{post.likes?.length || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
                            <MessageCircle size={18} />
                            <span className="font-medium">{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                  <div className="p-4 bg-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-2">No posts yet</p>
                  <p className="text-gray-500">
                    {isOwnProfile ? "Share your first post!" : `${user?.username} hasn't posted anything yet`}
                  </p>
                </div>
              )}
            </div>
            <div className="h-10"></div>
          </>
        )}
      </main>
    </div>
  );
}