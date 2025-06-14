"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, MessageCircle, ArrowLeft, Send, User, Clock, Image as ImageIcon } from "lucide-react";

function page() {
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
          `http://localhost:8080/api/posts/${postId}`,
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
        `http://localhost:8080/api/posts/${postId}/comment`,
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
        `http://localhost:8080/api/posts/${postId}/like`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Desktop sidebar spacing */}
      <div className="hidden md:block md:w-64 flex-shrink-0 fixed" />

      {/* Main content with proper spacing */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50 group"
            >
              <ArrowLeft size={20} className="group-hover:text-purple-400 transition-colors" />
              <span>Back to Feed</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6"></div>
              <p className="text-gray-400 text-lg">Loading post...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Post Card */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
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
                  <div className="mb-6 rounded-2xl overflow-hidden">
                    <img
                      src={post.image.url}
                      alt="Post image"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Interaction Bar */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-700/50">
                  <button
                    onClick={() => handleLikePost(postId)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isLiked()
                        ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                        : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={isLiked() ? "fill-current" : ""}
                    />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>
                  
                  <div className="flex items-center gap-3 px-6 py-3 text-gray-400">
                    <MessageCircle size={20} />
                    <span className="font-medium">{post.comments?.length || 0} Comments</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-200 flex items-center gap-3">
                  <MessageCircle size={24} className="text-purple-400" />
                  Comments ({post.comments?.length || 0})
                </h2>

                {/* Add Comment Form */}
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full h-32 p-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all duration-200"
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
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
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
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
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
                        className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
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
                  <div className="text-center py-12 bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl">
                    <div className="p-4 bg-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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

export default page;