'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId)
  }, []);

  async function handleLogout() {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, {
        withCredentials: true 
      })
      localStorage.setItem('isLoggedIn' , false); 
      localStorage.removeItem('userId'); 
      setIsLoggedIn(false);
      router.push('/login'); 
    } catch (err) {
      console.error('Error logging out:', err);
    }
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Social Media
        </Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link href={`/profile/${userId}`} className="hover:underline">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}