import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../components/UI/Loader";
import { useCreateCourseMutation } from "../../../features/api/courseApi";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (event) => {
    setCategory(event.target.value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created.");
      navigate("/admin/course");
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 mx-4 my-16">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add a course, add some basic course details for your new course
        </h1>
        <p className="text-sm text-gray-600">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            onChange={getSelectedCategory}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          >
            <option value="">Select a category</option>
            <option value="Next JS">Next JS</option>
            <option value="Data Science">Data Science</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Fullstack Development">Fullstack Development</option>
            <option value="MERN Stack Development">
              MERN Stack Development
            </option>
            <option value="Javascript">Javascript</option>
            <option value="React JS">React JS</option>
            <option value="Python">Python</option>
            <option value="Docker">Docker</option>
            <option value="MongoDB">MongoDB</option>
            <option value="HTML">HTML</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-300 hover:bg-gray-200"
            onClick={() => navigate("/admin/course")}
          >
            Back
          </button>
          <button
            disabled={isLoading}
            onClick={createCourseHandler}
            className="px-4 py-2 text-white bg-[#309255] rounded-md hover:opacity-85 disabled:bg-[#309255] flex items-center cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
