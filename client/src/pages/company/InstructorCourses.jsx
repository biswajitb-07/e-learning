import React from "react";
import { useParams } from "react-router-dom";
import { useGetInstructorCoursesQuery } from "../../features/api/companyApi";
import Loader from "../../components/UI/Loader";

const InstructorCourses = () => {
  const { instructorId } = useParams();
  const { data, isLoading, error } = useGetInstructorCoursesQuery(instructorId);

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        Error fetching instructor courses!
      </div>
    );

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Instructor's Courses
      </h1>

      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
        {data?.instructorCourses?.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border transition-all ease-linear duration-150  hover:scale-95 hover:shadow-green-400 cursor-pointer"
          >
            {/* Course Image */}
            {course.courseThumbnail && (
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-5 flex flex-col gap-3">
              {/* Course Title */}
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                {course.courseTitle}
              </h2>

              {/* Course Level Badge */}
              <p
                className={`text-white text-sm font-medium text-center px-4 py-1 rounded-full w-fit mx-auto 
                  ${course.courseLevel === "Beginner" ? "bg-green-500" : ""}
                  ${course.courseLevel === "Medium" ? "bg-yellow-500" : ""}
                  ${course.courseLevel === "Advance" ? "bg-red-500" : ""}`}
              >
                {course.courseLevel}
              </p>

              {/* Course Price */}
              <span className="block text-center text-lg font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                Price:
                <p className="text-green-500">{course.coursePrice}</p>
              </span>

              {/* Course Created Date */}
              <p className="text-sm text-gray-500 text-center">
                {new Date(course.createdAt).toLocaleDateString()}
              </p>

              {/* Enrolled Students Count */}
              <p className="text-sm text-gray-600 text-center font-bold">
                Enrolled Students:{" "}
                <strong className="text-blue-500">
                  {course.enrolledStudents?.length || 0}
                </strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {data?.instructorCourses?.length === 0 && (
        <div className="grid place-items-center">
          <h1 className="text-red-500 font-bold text-2xl">No course found!</h1>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
