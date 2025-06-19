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

  const currentUser = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user profile");
      }
      setIsLoading(false);
    }

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=100`, {
          withCredentials: true
        });
        
        const allPosts = res.data.posts || res.data; // Handle both old and new format
        
        const userPosts = allPosts.filter((post) => {
          const postUserId = post.userId?._id || post.userId;
          return postUserId === id;
        });
        
        setPosts(userPosts);
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

    if (!currentUser || currentUser === 'undefined') {
      setError("You must be logged in to follow");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/follow/${id}`,
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/unfollow/${id}`,
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex flex-col md:flex-row">
      {/* Left padding for sidebar on desktop */}
      <div className="hidden md:block md:w-64 flex-shrink-0" />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 px-3 md:px-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#FF6500]/30 border-t-[#FF6500] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="w-full max-w-2xl mb-8">
              <div className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-8 shadow-2xl">
                {/* Profile Avatar and Info */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
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
                        className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
                        onClick={handleUnfollow}
                      >
                        <UserMinus size={18} />
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 bg-gradient-to-r from-[#FF6500] to-orange-600 hover:from-orange-600 hover:to-[#FF6500] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#FF6500]/25"
                        onClick={handleFollow}
                      >
                        <UserPlus size={18} />
                        Follow
                      </button>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Section */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-xl">
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
                      className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-[#FF6500]/10 transition-all duration-300 cursor-pointer group hover:border-[#1E3E62]/50"
                    >
                      <Link href={`/posts/${post._id}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg">
                              {user?.username || "Unknown User"}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </p>
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
                        <div className="flex items-center gap-6 pt-4 border-t border-[#1E3E62]/30">
                          <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#FF6500] hover:bg-gradient-to-r hover:from-[#FF6500]/10 hover:to-orange-600/10 rounded-xl transition-all duration-200">
                            <Heart size={18} />
                            <span className="font-medium">{post.likes?.length || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#1E3E62] hover:bg-gradient-to-r hover:from-[#1E3E62]/10 hover:to-[#1E3E62]/5 rounded-xl transition-all duration-200">
                            <MessageCircle size={18} />
                            <span className="font-medium">{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl">
                  <div className="p-4 bg-gradient-to-r from-[#1E3E62]/30 to-[#1E3E62]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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