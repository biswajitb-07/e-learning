import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-[#212832] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-white">
        Lecture - {index + 1}: {lecture.lectureTitle}
      </h1>
      <svg
        onClick={goToUpdateLecture}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 cursor-pointer text-white hover:text-[#309255]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 3.487a2.25 2.25 0 113.182 3.183L7.5 19.214l-4.5 1.125 1.125-4.5 12.737-12.352z"
        />
      </svg>
    </div>
  );
};

export default Lecture;
