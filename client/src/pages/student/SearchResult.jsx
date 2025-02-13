import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-500 py-4 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-52 md:h-32 w-full md:w-56 object-center rounded"
        />
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="font-bold text-xl">{course.courseTitle}</h1>
          <p className="text-base text-gray-600">{course.subTitle}</p>
          <p className="text-base text-gray-700">
            Instructor:{" "}
            <span className="font-bold">{course.creator?.name}</span>
          </p>
          <span
            className={`${
              course.courseLevel === "Advance" ? "bg-[#309255]" : course.courseLevel === "Medium" ? "bg-orange-500" :"bg-yellow-500"
            } text-white text-sm font-semibold px-3 py-1 rounded w-fit`}
          >
            {course.courseLevel}
          </span>
        </div>
      </Link>
      <div className="text-left md:text-right w-auto">
        <h1 className="font-bold text-xl">₹{course.coursePrice}</h1>
      </div>
    </div>
  );
};

export default SearchResult;
