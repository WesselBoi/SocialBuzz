"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState();
  const { id } = useParams();

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
    } catch (err) {
      console.log("Error : ", err);
      setError("Error following user");
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-amber-400">
              Account info
            </h1>
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
            {isFollowing ? (
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={handleUnfollow}
                hidden={id === localStorage.getItem("userId")}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={handleFollow}
                hidden={id === localStorage.getItem("userId")}
              >
                Follow
              </button>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-4">
            Posts by {user.username}
          </h2>
          {posts.length > 0 ? (
            posts.map((post) => (
                <Link key={post._id} href={`/posts/${post._id}`}>
                  <div
                    key={post._id}
                    className="bg-white p-4 rounded-lg shadow-md mb-4"
                  >
                    <p>{post.content}</p>
                    {post.image.url && (
                      <img
                        src={post.image.url}
                        alt="Post"
                        className="mt-2 w-full h-auto rounded-lg"
                      />
                    )}
                    <div className="flex items-center mt-2 gap-10">
                      <span>
                        <Heart size={16} className="text-red-500" />
                        {post.likes?.length || 0} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} /> {post.comments?.length || 0}{" "}
                        Comments
                      </span>
                    </div>
                  </div>
                </Link>
            ))
          ) : (
            <p className="text-gray-500">No posts found.</p>
          )}
        </>
      )}
    </div>
  );
}
