import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoadUserQuery } from "../../features/api/authApi";

const Course = ({ course }) => {
  const navigate = useNavigate();

  const { data } = useLoadUserQuery();
  
  return (
    <div
      onClick={() => navigate(`/course-detail/${course._id}`)}
      className="overflow-hidden rounded-lg bg-[#EEFBF3] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mt-5 cursor-pointer"
    >
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt="course"
          className="w-full h-36 object-cover rounded-t-lg"
        />
      </div>
      <div className="px-5 py-4 space-y-3">
        <h1 className="font-bold text-lg truncate hover:underline">
          {course.courseTitle}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src={
                  course.creator?.photoUrl || "https://github.com/shadcn.png"
                }
                alt="creator"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="font-medium text-sm">{course.creator?.name}</h1>
          </div>
          <div
            className={`${
              course.courseLevel === "Advance"
                ? "bg-[#309255]"
                : course.courseLevel === "Medium"
                ? "bg-orange-500"
                : "bg-yellow-500"
            } text-white px-2 py-1 text-xs rounded-full`}
          >
            {course.courseLevel}
          </div>
        </div>
        <div className="text-lg font-bold">
          <span>₹ {course.coursePrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Course;
