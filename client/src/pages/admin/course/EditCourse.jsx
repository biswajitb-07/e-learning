import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="flex-1 p-4 my-10 sm:my-14 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3 sm:gap-0">
        <h1 className="font-bold text-lg sm:text-xl text-center sm:text-left">
          Add detailed information regarding the course
        </h1>
        <Link
          to="lecture"
          className="bg-[#309255] text-white px-4 py-2 rounded-lg shadow-md hover:opacity-85 transition text-center w-full sm:w-auto"
        >
          Go to lectures page
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;