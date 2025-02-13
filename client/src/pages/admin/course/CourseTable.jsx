import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCreatorCourseQuery } from "../../../features/api/courseApi";
import Loader from "../../../components/UI/Loader";

const CourseTable = () => {
  const navigate = useNavigate();

  const { data, isSuccess, isLoading, refetch } = useGetCreatorCourseQuery();

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );

  return (
    <div className="mt-16">
      <button
        onClick={() => navigate(`create`)}
        className="px-4 py-2 bg-[#309255] hover:opacity-85 cursor-pointer text-white rounded"
      >
        Create a new course
      </button>
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white border border-gray-200">
          <caption className="text-left text-gray-600 py-2">
            A list of your recent courses.
          </caption>
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 w-[100px] border-b text-left">Price</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Title</th>
              <th className="px-4 py-2 border-b text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.courses.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-left text-[#FFA200]">
                  {course?.coursePrice || "NA"}
                </td>
                <td className="px-4 py-2 text-left">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      course.isPublished ? "bg-[#309255]" : "bg-red-500"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-2 text-left text-[#FFA200]">
                  {course.courseTitle}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => navigate(`${course._id}`)}
                    className="px-3 py-1 bg-[#309255] text-white border rounded hover:opacity-85 cursor-pointer"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
