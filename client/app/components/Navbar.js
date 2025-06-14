"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Home, User, Search, LogOut, LogIn, UserPlus, Menu, X, Sparkles } from "lucide-react";

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
      <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
        <Home size={20} className="group-hover:text-purple-400 transition-colors" />
        <span className="font-medium">Home</span>
      </Link>
      
      <Link href="/search" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
        <Search size={20} className="group-hover:text-purple-400 transition-colors" />
        <span className="font-medium">Search</span>
      </Link>

      {isLoggedIn ? (
        <>
          <Link href={`/profile/${userId}`} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
            <User size={20} className="group-hover:text-purple-400 transition-colors" />
            <span className="font-medium">Profile</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group w-full text-left"
          >
            <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
            <span className="font-medium">Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
            <LogIn size={20} className="group-hover:text-purple-400 transition-colors" />
            <span className="font-medium">Login</span>
          </Link>
          <Link href="/register" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
            <UserPlus size={20} className="group-hover:text-purple-400 transition-colors" />
            <span className="font-medium">Register</span>
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <div className="mb-15 md:mb-0"></div>
      
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 flex-col py-8 px-4 z-40 shadow-2xl">
        <div className="flex-1">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 px-4 group">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Nexus
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="space-y-2">
            {navLinks}
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-6 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 px-4">
            © 2024 Nexus Social
          </p>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Nexus
          </span>
        </Link>
        
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Nexus
                  </span>
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Navigation Links */}
              <div className="flex-1 p-6">
                <div className="space-y-2">
                  {navLinks}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">
                  © 2024 Nexus Social
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}