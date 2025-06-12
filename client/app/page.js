"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);

    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const res = await axios.get("http://localhost:8080/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setIsLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  async function handleCreatePost() {
    if (!newPost.trim()) {
      setError("Post content cannot be empty");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/posts",
        {
          content: newPost,
        },
        {
          withCredentials: true,
        }
      );
      setPosts([res.data, ...posts]);
      setNewPost("");
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
    try {
      const res = await axios.post(
        `http://localhost:8080/api/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );
      setPosts(posts.map((post) => (post._id === postId ? res.data : post)));
      setError(null);
    } catch (err) {
      setError("Failed to like post. Consider logging in.");
    }
  }

  // Helper function to check if current user liked the post
  const isLikedByCurrentUser = (post) => {
    return currentUserId && post.likes?.includes(currentUserId);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Welcome to the Social Media App
        </h1>
        <div className="create-post mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-2"
          />
          <button
            onClick={handleCreatePost}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-60"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Posts section with loading state */}
        <div className="posts space-y-4">
          {isLoadingPosts ? (
            <div className="text-center py-8">
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="post bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <Link href={`/posts/${post._id}`}>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-blue-700 font-bold">
                      {post.userId?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <h2 className="font-semibold text-gray-700">
                      {post.userId?.username || "Unknown User"}
                    </h2>
                  </div>
                  <p className="text-gray-800 mb-2">{post.content}</p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        isLikedByCurrentUser(post) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'hover:text-red-500'
                      }`}
                      onClick={(e) => handleLikePost(post._id, e)}
                    >
                      <Heart 
                        size={16} 
                        className={isLikedByCurrentUser(post) ? 'fill-current' : ''} 
                      /> 
                      {post.likes?.length || 0} Likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} /> {post.comments?.length || 0}{" "}
                      Comments
                    </span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}