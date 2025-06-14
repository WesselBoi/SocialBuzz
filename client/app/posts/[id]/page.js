"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, MessageCircle, ArrowBigLeft } from "lucide-react";

function page() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      setTimeout(() => setCommentError(null), 3000);
      setIsLoading(false);
      return;
    }
    if (!currentUser || currentUser === "undefined") {
      setCommentError("You must be logged in to comment");
      setTimeout(() => setCommentError(null), 10000);
      setIsLoading(false);
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
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding comment:", err);
      setIsLoading(false);
    }
  }

  async function handleLikePost(postId) {
    if (!currentUser || currentUser === "undefined") {
      setError("You must be logged in to like posts");
      setTimeout(() => setError(null), 5000);
      return
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar spacing */}
      <div className="hidden md:block md:w-56 flex-shrink-0 fixed" />

      {/* Main content with proper spacing */}
      <div className="md:ml-56 pt-20 md:pt-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back button - positioned consistently */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors"
            >
              <ArrowBigLeft size={20} />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : (
            <>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">
                  {post.title}
                </h1>
                <p className="text-gray-700 mb-4 text-center">{post.content}</p>
                <div className="text-gray-600 mb-4 text-sm flex gap-4 justify-center">
                  <span className="flex items-center gap-1">
                    {isLiked() ? (
                      <Heart
                        size={16}
                        className="text-red-500 fill-current cursor-pointer"
                        onClick={() => handleLikePost(postId)}
                      />
                    ) : (
                      <Heart
                        size={16}
                        className="text-red-500 cursor-pointer hover:fill-red-400 transition-all"
                        onClick={() => handleLikePost(postId)}
                      />
                    )}
                    {post.likes?.length || 0} Likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> {post.comments?.length || 0}{" "}
                    Comments
                  </span>
                </div>
                {/* Display post image if exists */}
                {post.image && post.image.url && (
                  <div className="mb-3">
                    <img
                      src={post.image.url}
                      alt="Post image"
                      className="w-full h-auto object-cover rounded-md border"
                    />
                  </div>
                )}
                <p className="text-gray-500 text-sm text-center">
                  <Link
                    href={`/profile/${post.userId._id}`}
                    className="hover:underline"
                  >
                    Posted by {post.userId.username} on{" "}
                  </Link>
                  {new Date(post.createdAt).toLocaleDateString()}
                  <br />
                  {error && <span className="text-red-500 ml-2">{error}</span>}
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
                Comments
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter comment..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-2"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-60"
                >
                  {isLoading ? "Adding Comment..." : "Add Comment"}
                </button>
                <br />
                {commentError && (
                  <span className="text-red-500 mt-2 flex justify-center">
                    {commentError}
                  </span>
                )}
              </div>

              {post.comments.length > 0 ? (
                <ul className="space-y-3">
                  {post.comments.map((comment) => (
                    <li
                      key={comment._id}
                      className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <Link href={`/profile/${comment.userId._id}`}>
                        <p className="text-gray-500 text-sm">
                          by {comment.userId.username} on{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-center py-8 bg-white rounded-lg">
                  No comments yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
  // ...existing code...
}

export default page;
