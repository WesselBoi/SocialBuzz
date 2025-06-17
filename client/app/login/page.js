"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      router.push("/");
    }
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
        {
          email,
          password,
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
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", res.data.userId);
      setIsLoading(false);
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Failed to login. Please check your credentials and try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex flex-col md:flex-row">
      {/* Left padding for sidebar on desktop */}
      <div className="hidden md:block md:w-64 flex-shrink-0" />

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-2xl shadow-lg flex items-center justify-center">
                <Image
                  src="/image-copy.png"
                  alt="SocialBuzz Logo"
                  width={64}
                  height={64}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                SocialBuzz
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Welcome back to your social world
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-xl">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-200">Sign In</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-[#1E3E62]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 focus:border-[#FF6500]/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-[#1E3E62]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 focus:border-[#FF6500]/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FF6500] to-orange-700 hover:from-orange-700 hover:to-[#FF6500] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#FF6500]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#1E3E62]/30">
              <p className="text-center text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#FF6500] hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
