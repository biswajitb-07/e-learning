import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative bg-[#EEFBF3] py-28 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-[#1D2733] text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        {/* Subtitle */}
        <p className="text-[#1D2733] text-sm sm:text-base md:text-lg mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>
        {/* Search Form */}
        <form
          onSubmit={searchHandler}
          className="flex flex-row items-center bg-[#EEFBF3] rounded-full shadow-lg overflow-hidden max-w-lg mx-auto"
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search courses..."
            className="flex-grow border-none focus:ring-0 px-4 py-3 text-sm sm:text-base text-[#1D2733] outline-none"
          />
          <button
            type="submit"
            className="bg-[#309255] text-white px-6 py-3 text-sm sm:text-base font-semibold rounded-full sm:rounded-l-none hover:opacity-85 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
        <button
          onClick={() => navigate(`/course/search?query`)}
          type="submit"
          className="bg-[#309255] rounded-full mt-6 px-5 py-3 cursor-pointer text-white font-semibold hover:opacity-85"
        >
          Explore Courses
        </button>
      </div>
    </div>
  );
};

export default Hero;
