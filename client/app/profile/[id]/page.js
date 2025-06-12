'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
        console.error('Error fetching user:', error);
      }
        setIsLoading(false);
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPosts(res.data.filter((post) => post.userId._id === id));
      } catch (error) {
          setError('Failed to fetch posts');
        console.error('Error fetching posts:', error);
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [id]);


  return (
    <div className="container mx-auto p-4 max-w-2xl">
        {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
        ) : (
            <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
            </div>
    
            <h2 className="text-xl font-semibold mb-4">Posts by {user.username}</h2>
            {posts.length > 0 ? (
                posts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <p>{post.content}</p>
                </div>
                ))
            ) : (
                <p className="text-gray-500">No posts found.</p>
            )}
            </>
        )}
    </div>
  );
}