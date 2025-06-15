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
      <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1E3E62]/50 rounded-xl transition-all duration-200 group">
        <Home size={20} className="group-hover:text-[#FF6500] transition-colors" />
        <span className="font-medium">Home</span>
      </Link>
      
      <Link href="/search" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1E3E62]/50 rounded-xl transition-all duration-200 group">
        <Search size={20} className="group-hover:text-[#FF6500] transition-colors" />
        <span className="font-medium">Search</span>
      </Link>

      {isLoggedIn ? (
        <>
          <Link href={`/profile/${userId}`} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1E3E62]/50 rounded-xl transition-all duration-200 group">
            <User size={20} className="group-hover:text-[#FF6500] transition-colors" />
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
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1E3E62]/50 rounded-xl transition-all duration-200 group">
            <LogIn size={20} className="group-hover:text-[#FF6500] transition-colors" />
            <span className="font-medium">Login</span>
          </Link>
          <Link href="/register" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1E3E62]/50 rounded-xl transition-all duration-200 group">
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
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-[#0B192C] border-r border-[#1E3E62]/30 flex-col py-8 px-4 z-40 shadow-2xl">
        <div className="flex-1">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 px-4 group">
            <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Nexus
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
            © 2025 Nexus Social
          </p>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="md:hidden bg-[#0B192C] border-b border-[#1E3E62]/30 p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Nexus
          </span>
        </Link>
        
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1E3E62]/50 rounded-lg transition-all duration-200"
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
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0B192C] border-l border-[#1E3E62]/30 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1E3E62]/30">
                <div className="flex items-center gap-2">
                  {/* <div className="p-2 bg-[#FF6500] rounded-lg"> */}
                  <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Nexus
                  </span>
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#1E3E62]/50 rounded-lg transition-all duration-200"
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
                  © 2025 Nexus Social
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}