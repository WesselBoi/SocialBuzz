"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, MessageCircle, ArrowLeft, Send, User, Clock, Image as ImageIcon, Sparkles } from "lucide-react";

function Page() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);

  const currentUser = localStorage.getItem("userId");

  const postId = useParams().id;
  useEffect(() => {
    async function getPostById() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/${postId}`,
          {
            withCredentials: true,
          }
        );
        setPost(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to fetch post. Please try again.");
        setIsLoading(false);
      }
    }
    getPostById();
  }, [postId]);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    setIsCommentLoading(true);
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      setTimeout(() => setCommentError(null), 3000);
      setIsCommentLoading(false);
      return;
    }
    if (!currentUser || currentUser === "undefined") {
      setCommentError("You must be logged in to comment");
      setTimeout(() => setCommentError(null), 10000);
      setIsCommentLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/${postId}/comment`,
        {
          content: newComment,
        },
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, res.data],
      }));
      setNewComment("");
      setIsCommentLoading(false);
    } catch (err) {
      console.error("Error adding comment:", err);
      setIsCommentLoading(false);
    }
  }

  async function handleLikePost(postId) {
    if (!currentUser || currentUser === "undefined") {
      setError("You must be logged in to like posts");
      setTimeout(() => setError(null), 5000);
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
      setPost(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to like post.");
    }
  }

  function isLiked() {
    return (
      post && post.likes && post.likes.includes(localStorage.getItem("userId"))
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900">
      {/* Desktop sidebar spacing */}
      <div className="hidden md:block md:w-64 flex-shrink-0 fixed" />

      {/* Main content with proper spacing */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1E3E62]/50 to-[#1E3E62]/30 hover:from-[#1E3E62]/70 hover:to-[#1E3E62]/50 text-gray-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-xl border border-[#1E3E62]/50 hover:border-[#FF6500]/50 group"
            >
              <ArrowLeft size={20} className="group-hover:text-[#FF6500] transition-colors" />
              <span>Back to Feed</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#FF6500]/30 border-t-[#FF6500] rounded-full animate-spin mb-6"></div>
              <p className="text-gray-400 text-lg">Loading post...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl max-w-md mx-auto">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Post Card */}
              <div className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-8 shadow-2xl">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                    {post.userId?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${post.userId._id}`}
                      className="block group"
                    >
                      <h3 className="font-bold text-gray-200 text-xl group-hover:text-white transition-colors">
                        {post.userId?.username || "Unknown User"}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <Clock size={14} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                {post.content && (
                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Post Image */}
                {post.image && post.image.url && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-[#1E3E62]/50">
                    <img
                      src={post.image.url}
                      alt="Post image"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Interaction Bar */}
                <div className="flex items-center gap-6 pt-6 border-t border-[#1E3E62]/30">
                  <button
                    onClick={() => handleLikePost(postId)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isLiked()
                        ? "text-[#FF6500] bg-gradient-to-r from-[#FF6500]/10 to-orange-700/10 hover:from-[#FF6500]/20 hover:to-orange-700/20 cursor-pointer"
                        : "text-gray-400 hover:text-[#FF6500] hover:bg-gradient-to-r hover:from-[#FF6500]/10 hover:to-orange-700/10 cursor-pointer"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={isLiked() ? "fill-current" : ""}
                    />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>
                  
                  <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-[#1E3E62] hover:bg-gradient-to-r hover:from-[#1E3E62]/10 hover:to-[#1E3E62]/5 rounded-xl transition-all duration-200">
                    <MessageCircle size={20} />
                    <span className="font-medium">{post.comments?.length || 0} Comments</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Comments ({post.comments?.length || 0})
                  </h2>
                </div>

                {/* Add Comment Form */}
                <div className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-6 shadow-xl">
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full h-32 p-4 bg-black/30 border border-[#1E3E62]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 focus:border-[#FF6500]/50 resize-none transition-all duration-200 backdrop-blur-sm"
                      />
                      {newComment && (
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                          {newComment.length}/500
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isCommentLoading || !newComment.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#FF6500] to-orange-700 hover:from-orange-700 hover:to-[#FF6500] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#FF6500]/25"
                      >
                        {isCommentLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Comment
                          </>
                        )}
                      </button>
                    </div>

                    {commentError && (
                      <div className="p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-sm">{commentError}</p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gradient-to-br from-[#0B192C]/60 to-[#1E3E62]/30 backdrop-blur-xl border border-[#1E3E62]/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-[#FF6500]/5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#1E3E62] to-[#132949] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {comment.userId?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Link
                                href={`/profile/${comment.userId._id}`}
                                className="font-semibold text-gray-300 hover:text-white transition-colors"
                              >
                                {comment.userId?.username || "Unknown User"}
                              </Link>
                              <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <Clock size={12} />
                                <span>{formatDate(comment.createdAt)}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl">
                    <div className="p-4 bg-gradient-to-r from-[#1E3E62]/30 to-[#1E3E62]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No comments yet</p>
                    <p className="text-gray-500">Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;