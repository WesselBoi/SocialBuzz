"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

function page() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError("Comment cannot be empty");
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
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-2xl">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-4 text-center">
                {post.title}
              </h1>
              <p className="text-gray-700 mb-4 text-center">{post.content}</p>
              <div className="text-gray-600 mb-4 text-sm flex gap-4 justify-center">
                <span className="flex items-center gap-1">
                  <Heart size={16} className="text-red-500" />
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
                    className="w-full h-full object-cover rounded-md border"
                  />
                </div>
              )}
              <p className="text-gray-500 text-sm text-center">
                <Link href={`/profile/${post.userId._id}`} className="hover:underline">
                  Posted by {post.userId.username} on{" "}
                </Link>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
              Comments
            </h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter comment..."
              className="w-full h-auto p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-2"
            ></textarea>
            <button
              onClick={handleCommentSubmit}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-60"
            >
              {isLoading ? "Adding Comment..." : "Add Comment"}
            </button>
            {post.comments.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {post.comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-gray-500 text-sm">
                      by {comment.userId.username} on{" "}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-center">No comments yet.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default page;
