"use client";
import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
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
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search users by username"
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      <ul className='bg-blue-200'>
        {results.map(user => (
          <li key={user._id} className="mb-2">
            <Link href={`/profile/${user._id}`}>
              <span className="text-blue-600 hover:underline">{user.username}</span>
            </Link>
          </li>
        ))}
        {results.length === 0 && !error && (
          <li className="text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  );
}

export default Search;