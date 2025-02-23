import React, { useState } from "react";
import {
  useDeleteInstructorCourseMutation,
  useGetAllCoursesQuery,
} from "../../features/api/companyApi";
import Loader from "../../components/UI/Loader";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const GetAllCourses = () => {
  const { data, isLoading, error } = useGetAllCoursesQuery();
  const [loadingCourseId, setLoadingCourseId] = useState(null);

  const [deleteInstructorCourse] = useDeleteInstructorCourseMutation();

  const deleteCourseHandle = async (courseId) => {
    setLoadingCourseId(courseId);
    try {
      await deleteInstructorCourse(courseId).unwrap();
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error("Failed to delete course");
    } finally {
      setLoadingCourseId(null);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        Error fetching courses!
      </div>
    );

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        All Courses
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {data?.courses?.map((course) => (
          <div
            key={course._id}
            className="relative bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-green-500"
          >
            {/* Delete Icon */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteCourseHandle(course._id);
              }}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 cursor-pointer bg-white rounded-full p-2 shadow-md"
              disabled={loadingCourseId === course._id}
            >
              {loadingCourseId === course._id ? (
                <Loader />
              ) : (
                <FaTrash size={20} />
              )}
            </button>

            {/* Course Image */}
            {course.courseThumbnail && (
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6 flex flex-col gap-4">
              {/* Course Title */}
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                {course.courseTitle}
              </h2>

              {/* Course Level Badge */}
              <div className="flex justify-center">
                <span
                  className={`text-sm font-semibold px-4 py-1 rounded-full 
                    ${
                      course.courseLevel === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : course.courseLevel === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {course.courseLevel}
                </span>
              </div>

              {/* Course Price */}
              <div className="text-center">
                <span className="text-lg font-medium text-gray-700">
                  Price:{" "}
                  <span className="text-green-600 font-bold">
                    {course.coursePrice}
                  </span>
                </span>
              </div>

              {/* Course Created Date */}
              <p className="text-sm text-gray-500 text-center">
                Created on: {new Date(course.createdAt).toLocaleDateString()}
              </p>

              {/* Enrolled Students Count */}
              <div className="text-center">
                <p className="text-sm text-gray-600 font-bold">
                  Enrolled Students:{" "}
                  <span className="text-blue-600">
                    {course.enrolledStudents?.length || 0}
                  </span>
                </p>
              </div>

              {/* Creator Info */}
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-col justify-between items-center text-sm text-gray-700">
                  <div>
                    <strong>Creator: </strong>
                    <span>{course.creator?.name}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <strong>Email: </strong>
                    <span>{course.creator?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.courses?.length === 0 && (
        <div className="grid place-items-center mt-10">
          <h1 className="text-red-500 font-bold text-2xl">No courses found!</h1>
        </div>
      )}
    </div>
  );
};

export default GetAllCourses;
