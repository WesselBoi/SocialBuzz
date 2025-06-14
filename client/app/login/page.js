"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Desktop sidebar spacing */}
      <div className="hidden md:block md:w-56 flex-shrink-0 fixed" />
      
      {/* Main content with proper spacing */}
      <div className="md:ml-56 pt-20 md:pt-8 px-4 w-full flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && (
            <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default page;