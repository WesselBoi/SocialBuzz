"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  async function handleLogout() {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("isLoggedIn", false);
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  // Navigation links for reuse
  const navLinks = (
    <>
      {isLoggedIn ? (
        <>
          <Link href={`/profile/${userId}`} className="hover:underline block px-4 py-2">
            Profile
          </Link>
          <button onClick={handleLogout} className="hover:underline block px-4 py-2 text-left w-full">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="hover:underline block px-4 py-2">
            Login
          </Link>
          <Link href="/register" className="hover:underline block px-4 py-2">
            Register
          </Link>
        </>
      )}
      <Link href="/search" className="hover:underline block px-4 py-2">
        Search
      </Link>
    </>
  );

  return (
    <>
    <div className="mb-10"></div>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-56 bg-blue-600 text-white flex-col justify-between py-8 px-4 z-40">
        <div>
          <Link href="/" className="text-2xl font-bold mb-8 block">
            Social Media
          </Link>
          <div className="space-y-2">{navLinks}</div>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <Link href="/" className="text-xl font-bold">
          Social Media
        </Link>
        <button
          className="focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="white" />
            <rect y="11" width="24" height="2" rx="1" fill="white" />
            <rect y="17" width="24" height="2" rx="1" fill="white" />
          </svg>
        </button>
        {/* Mobile menu overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-60 backdrop-blur-xs z-50"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="absolute top-0 left-0 w-56 h-full bg-blue-600 shadow-lg flex flex-col py-8 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="self-end mb-6 focus:outline-none"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" />
                  <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" />
                </svg>
              </button>
              <div className="space-y-2">{navLinks}</div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}