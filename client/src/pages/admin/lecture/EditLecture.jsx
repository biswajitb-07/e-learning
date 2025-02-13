import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 my-16">
        <div className="flex items-center gap-5">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-[#309255] cursor-pointer hover:text-white transition">
              <FaArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="font-bold text-xl text-gray-800">
            Update Your Lecture
          </h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
};

export default EditLecture;
