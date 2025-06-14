"use client";
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Search as SearchIcon, User, Users, Sparkles } from 'lucide-react'

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users as the user types (debounced)
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/users?username=${encodeURIComponent(searchTerm)}`
        );
        setResults(res.data);
        setError(null);
      } catch (err) {
        setError("Error searching users");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col md:flex-row">
      {/* Left padding for sidebar on desktop */}
      <div className="hidden md:block md:w-64 flex-shrink-0" />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 px-3 md:px-6">
        {/* Hero section */}
        <div className="w-full max-w-2xl mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <SearchIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Search
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Discover amazing people on Nexus</p>
          </div>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-8 shadow-2xl">
          <form onSubmit={e => e.preventDefault()} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search users by username..."
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-lg"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="w-full max-w-2xl">
          {searchTerm && (
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Searching users...</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="p-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">Found {results.length} user{results.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-700/50">
                    {results.map(user => (
                      <Link 
                        key={user._id}
                        href={`/profile/${user._id}`}
                        className="block p-6 hover:bg-gray-700/30 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-200 font-semibold text-lg group-hover:text-white transition-colors duration-200">
                              {user.username}
                            </h3>
                            <p className="text-gray-400 text-sm">Click to view profile</p>
                          </div>
                          <div className="flex items-center text-gray-400 group-hover:text-purple-400 transition-colors duration-200">
                            <User className="w-5 h-5" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-2">No users found</p>
                  <p className="text-gray-500">Try searching with a different username</p>
                </div>
              )}
            </div>
          )}

          {!searchTerm && (
            <div className="text-center py-12 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
              <div className="p-4 bg-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <SearchIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">Start typing to search</p>
              <p className="text-gray-500">Find and connect with other users on Nexus</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Search;