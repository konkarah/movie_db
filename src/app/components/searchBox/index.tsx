"use client";

// Imports Start
import React, { useState } from "react";
import SearchBox from "../custom/Search";
import { useRouter } from "next/navigation";
// Imports End

const SearchPage = () => {
  // State Variables Start
  const [query, setQuery] = useState("");
  // State Variables End

  // Router Start
  const router = useRouter();
  // Router End

  // Handle Submit Start
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return; // skip too short queries
    }

    router.push(`/search/${encodeURIComponent(trimmedQuery)}`);
    setQuery(""); // clear field after submit
  };
  // Handle Submit End

  return (
    <div className="p-6">
      {/* Form Input Start */}
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
        <SearchBox
          placeholder="Search movies..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        <button
          type="submit"
          aria-label="Search movies"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </form>
      {/* Form Input End */}
    </div>
  );
};

export default SearchPage;
