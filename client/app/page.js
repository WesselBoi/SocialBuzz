"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, MessageCircle, X, Image, Plus, Sparkles } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likeError, setLikeError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // make it a useCallback
  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setIsLoadingPosts(true);
      else setIsLoadingMore(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?page=${pageNum}&limit=10`
      );

      if (reset) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }

      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setIsLoadingPosts(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
    fetchPosts(1, true);
  }, [fetchPosts]);

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchPosts(page + 1);
    }
  };

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  }

  function removeImage() {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  }

  async function handleCreatePost() {
    if (!newPost.trim() && !selectedImage) {
      setError("Post content cannot be empty");
      return;
    }
    if (currentUserId === null || currentUserId === undefined) {
      setError("You must be logged in to create a post.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("content", newPost || "");
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts([res.data, ...posts]);
      setNewPost("");
      setSelectedImage(null);
      setImagePreview(null);
      setError(null);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLikePost(postId, event) {
    event.preventDefault();
    event.stopPropagation();
    if (!currentUserId) {
      window.alert("You must be logged in to like a post.");
      setLikeError("You must be logged in to like a post.");
      setTimeout(() => setLikeError(null), 3000);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );
      setPosts(posts.map((post) => (post._id === postId ? res.data : post)));
      setError(null);
    } catch (err) {
      setError("Failed to like post. Please try again.");
    }
  }

  // Helper function to check if current user liked the post
  const isLikedByCurrentUser = (post) => {
    return currentUserId && post.likes?.includes(currentUserId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex flex-col md:flex-row">
      {/* Left padding for sidebar on desktop */}
      <div className="hidden md:block md:w-64 flex-shrink-0" />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 px-3 md:px-6">
        {/* Hero section */}
        <div className="w-full max-w-2xl mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-2xl shadow-lg">
                <img
                  src="/image-copy.png"
                  alt="SocialBuzz Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                SocialBuzz
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Share your thoughts with the world
            </p>
          </div>
        </div>

        {/* Create Post Card */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62]/50 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="create-post">
            <div className="relative">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening?"
                className="w-full h-32 p-4 bg-black/30 border border-[#1E3E62]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 focus:border-[#FF6500]/50 resize-none transition-all duration-200 backdrop-blur-sm"
              />
              {newPost && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {newPost.length}/280
                </div>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-4 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border border-[#1E3E62]/50"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-sm text-white rounded-full p-2 hover:from-red-600 hover:to-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-3">
                <label className="flex items-center gap-2 bg-gradient-to-r from-[#1E3E62]/50 to-[#1E3E62]/30 hover:from-[#1E3E62]/70 hover:to-[#1E3E62]/50 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 border border-[#1E3E62]/50 hover:border-[#FF6500]/50 backdrop-blur-sm">
                  <Image size={18} className="text-[#FF6500]" />
                  <span className="text-sm text-gray-300">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={isLoading || (!newPost.trim() && !selectedImage)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF6500] to-orange-600 hover:from-orange-600 hover:to-[#FF6500] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#FF6500]/25"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Post
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {likeError && (
              <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-red-400 text-sm">{likeError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="w-full max-w-2xl space-y-6">
          {isLoadingPosts ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#FF6500]/30 border-t-[#FF6500] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading your feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl">
              <div className="p-4 bg-gradient-to-r from-[#1E3E62]/30 to-[#1E3E62]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No posts yet</p>
              <p className="text-gray-500">
                Be the first to share something amazing!
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-6 shadow-2xl hover:shadow-2xl hover:shadow-[#FF6500]/10 transition-all duration-300 cursor-pointer group hover:border-[#1E3E62]/50"
                >
                  <Link href={`/posts/${post._id}`} className="cursor-auto">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                        {post.userId?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg">
                          {post.userId?.username || "Unknown User"}
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
                    {post.image && post.image.url && (
                      <div className="mb-4 rounded-xl overflow-hidden">
                        <img
                          src={post.image.url}
                          alt="Post image"
                          className="w-full h-150 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Interaction Bar */}
                    <div className="flex items-center gap-6 pt-4 border-t border-[#1E3E62]/30">
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                          isLikedByCurrentUser(post)
                            ? "text-[#FF6500] bg-gradient-to-r from-[#FF6500]/10 to-orange-600/10 hover:from-[#FF6500]/20 hover:to-orange-600/20 cursor-pointer"
                            : "text-gray-400 hover:text-[#FF6500] hover:bg-gradient-to-r hover:from-[#FF6500]/10 hover:to-orange-600/10 cursor-pointer"
                        }`}
                        onClick={(e) => handleLikePost(post._id, e)}
                      >
                        <Heart
                          size={18}
                          className={
                            isLikedByCurrentUser(post) ? "fill-current" : ""
                          }
                        />
                        <span className="font-medium">
                          {post.likes?.length || 0}
                        </span>
                      </button>

                      <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#1E3E62] hover:bg-gradient-to-r hover:from-[#1E3E62]/10 hover:to-[#1E3E62]/5 rounded-xl transition-all duration-200">
                        <MessageCircle size={18} />
                        <span className="font-medium">
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center py-6">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-[#FF6500] to-orange-600 hover:from-orange-600 hover:to-[#FF6500] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="h-10"></div>
      </main>
    </div>
  );
}