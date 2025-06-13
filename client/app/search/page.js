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
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={e => e.preventDefault()} className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search users by username"
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled>
          Search
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      <ul className='bg-blue-200'>
        {searchTerm && results.map(user => (
          <li key={user._id} className="mb-2">
            <Link href={`/profile/${user._id}`}>
              <span className="text-blue-600 hover:underline">{user.username}</span>
            </Link>
          </li>
        ))}
        {searchTerm && results.length === 0 && !error && (
          <li className="text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  );
}

export default Search;