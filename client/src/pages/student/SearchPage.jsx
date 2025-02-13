import React, { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { useGetSearchCourseQuery } from "../../features/api/courseApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12">
      <div className="my-8">
        <h1 className="font-bold text-2xl lg:text-3xl">
          Results for "{query}"
        </h1>
        <p>
          Showing results for{" "}
          <span className="text-blue-800 font-bold italic">{query}</span>
        </p>
      </div>

      <form
        onSubmit={searchHandler}
        className="flex flex-row items-center bg-[#EEFBF3] rounded-full shadow-lg overflow-hidden max-w-2xl mx-auto mb-10"
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

      <div className="flex flex-col lg:flex-row gap-12">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-40 bg-gray-100 dark:bg-gray-900 p-8">
      <AiOutlineExclamationCircle className="text-red-500 h-20 w-20 mb-6" />
      <h1 className="font-bold text-3xl lg:text-5xl text-gray-800 dark:text-gray-200 mb-3">
        Course Not Found
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic text-blue-600 hover:underline text-lg">
        Browse All Courses
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between border-b border-gray-300 py-6 animate-pulse">
      <div className="h-40 w-full lg:w-72 bg-gray-300" />
      <div className="flex flex-col gap-3 flex-1 px-6">
        <div className="h-7 w-3/4 bg-gray-300" />
        <div className="h-5 w-1/2 bg-gray-300" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-1/3 bg-gray-300" />
        </div>
        <div className="h-7 w-24 bg-gray-300 mt-3" />
      </div>
      <div className="flex flex-col items-end justify-between mt-6 lg:mt-0">
        <div className="h-7 w-14 bg-gray-300" />
      </div>
    </div>
  );
};
