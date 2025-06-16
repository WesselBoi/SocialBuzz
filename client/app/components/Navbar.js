"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Home, User, Search, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";

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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`,
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
      <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-xl transition-all duration-200 group">
        <Home size={20} className="group-hover:text-[#FF6500] transition-colors" />
        <span className="font-medium">Home</span>
      </Link>
      
      <Link href="/search" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-xl transition-all duration-200 group">
        <Search size={20} className="group-hover:text-[#FF6500] transition-colors" />
        <span className="font-medium">Search</span>
      </Link>

      {isLoggedIn ? (
        <>
          <Link href={`/profile/${userId}`} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-xl transition-all duration-200 group">
            <User size={20} className="group-hover:text-[#FF6500] transition-colors" />
            <span className="font-medium">Profile</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-xl transition-all duration-200 group w-full text-left"
          >
            <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
            <span className="font-medium">Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-xl transition-all duration-200 group">
            <LogIn size={20} className="group-hover:text-[#FF6500] transition-colors" />
            <span className="font-medium">Login</span>
          </Link>
          <Link href="/register" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-xl transition-all duration-200 group">
            <UserPlus size={20} className="group-hover:text-[#FF6500] transition-colors" />
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
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0B192C] to-[#1E3E62]/80 backdrop-blur-xl border-r border-[#1E3E62]/30 flex-col py-8 px-4 z-40 shadow-2xl">
        <div className="flex-1">
          {/* Logo */}
                <Link href="/" className="flex items-center gap-3 mb-12 px-4 group">
                <div className="w-20 h-20 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg flex items-center justify-center">
                  <img
                  src="/image-copy.png"
                  alt="SocialBuzz Logo"
                  className="w-32 h-32 object-contain"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SocialBuzz
                </span>
                </Link>
                
                {/* Navigation Links */}
          <div className="space-y-2">
            {navLinks}
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-6 border-t border-[#1E3E62]/30">
          <p className="text-xs text-gray-500 px-4">
            © 2025 SocialBuzz Social
          </p>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="md:hidden bg-gradient-to-r from-[#0B192C] to-[#1E3E62]/100 backdrop-blur-xl border-b border-[#1E3E62]/30 p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-12 h-8 rounded-lg p-1 shadow-lg flex items-center justify-center">
            <Image
              src="/image-copy.png"
              alt="SocialBuzz Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            SocialBuzz
          </span>
        </Link>
        
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-lg transition-all duration-200"
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
            className="absolute inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[#0B192C] to-[#1E3E62]/80 backdrop-blur-xl border-l border-[#1E3E62]/30 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1E3E62]/30">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded-lg p-1 shadow-lg flex items-center justify-center">
                    <Image
                      src="/image-copy.png"
                      alt="SocialBuzz Logo"
                      width={64}
                      height={64}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    SocialBuzz
                  </span>
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-[#1E3E62]/50 hover:to-[#1E3E62]/30 rounded-lg transition-all duration-200"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Navigation Links */}
              <div className="flex-1 p-6">
                <div className="space-y-2" onClick={() => setMenuOpen(false)}>
                  {navLinks}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-[#1E3E62]/30">
                <p className="text-xs text-gray-500">
                  © 2025 SocialBuzz Social
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}