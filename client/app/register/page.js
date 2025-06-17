"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User } from "lucide-react";

function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      router.push("/");
    }
  }, [router]);

  async function handleRegister(e) {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`,
        {
          username,
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
      setIsLoading(false);
      router.push("/login");
    } catch (err) {
      console.error("Error registering:", err);
      setIsLoading(false);

      if (err.response && err.response.status === 400) {
        setError(
          err.response.data.error || "User already exists with this email"
        );
      } else {
        setError("Failed to register. Please try again.");
      }
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
              <div className="w-32 h-32rounded-2xl shadow-lg flex items-center justify-center">
                <Image
                  src="/image-copy.png"
                  alt="SocialBuzz Logo"
                  width={56}
                  height={56}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                SocialBuzz
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Join the social revolution</p>
          </div>

          {/* Register Form */}
          <div className="bg-gradient-to-br from-[#0B192C]/80 to-[#1E3E62]/40 backdrop-blur-xl border border-[#1E3E62]/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#FF6500] to-orange-700 rounded-xl">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-200">
                Create Account
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-[#1E3E62]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 focus:border-[#FF6500]/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-[#1E3E62]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 focus:border-[#FF6500]/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Confirm your password"
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#1E3E62]/30">
              <p className="text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#FF6500] hover:text-orange-700 font-medium transition-colors duration-200"
                >
                  Sign In
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
