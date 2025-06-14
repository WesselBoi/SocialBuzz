"use client";
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users as the user types (debounced)
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setError(null);
      return;
    }
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
      }
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar spacing */}
      <div className="hidden md:block md:w-56 flex-shrink-0 fixed" />
      
      {/* Main content with proper spacing */}
      <div className="md:ml-56 pt-20 md:pt-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Search Users
            </h1>
            
            <form onSubmit={e => e.preventDefault()} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search users by username"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-6 py-3 rounded-md opacity-50 cursor-not-allowed" 
                  disabled={!searchTerm.trim()}
                >
                  Search
                </button>
              </div>
            </form>
            
            {error && (
              <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            {searchTerm && (
              <div className="bg-gray-50 rounded-md">
                {results.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {results.map(user => (
                      <li key={user._id} className="p-4 hover:bg-gray-100 transition-colors">
                        <Link 
                          href={`/profile/${user._id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                          <span className="text-gray-800 hover:text-blue-600 font-medium">
                            {user.username}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;