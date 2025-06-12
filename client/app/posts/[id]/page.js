"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";

function page() {
  const [post, setPost] = useState(null);
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

  return (
    <div>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-4">{post.content}</p>
          <div className="text-gray-600 mb-4 text-sm">
            Likes : {post.likes.length} | Comments : {post.comments.length}
          </div>
          <p className="text-gray-500 text-sm">
            Posted by {post.userId.username} on{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default page;
