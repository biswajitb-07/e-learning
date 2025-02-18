import React from "react";
import { useGetAllUsersQuery } from "../../features/api/companyApi";
import Loader from "../../components/UI/Loader";

const GetAllUsers = () => {
  const { data, isLoading, error } = useGetAllUsersQuery();

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500">Error fetching users!</div>
    );

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-2xl font-bold mb-6 text-center">User List</h1>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 ">
        {data?.users?.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-lg rounded-lg p-5 border cursor-pointer transition-all duration-150 ease-linear hover:scale-95 hover:shadow-green-400"
          >
            {/* User Image */}
            {user.photoUrl && (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border"
              />
            )}

            {/* User Info */}
            <h2 className="text-xl font-semibold text-center">{user.name}</h2>
            <p className="text-gray-600 text-center">{user.email}</p>
            <span
              className={`block text-center text-sm text-white px-3 py-1 rounded-full w-fit mx-auto my-2 bg-green-600`}
            >
              {user.role}
            </span>

            {/* Enrolled Courses */}
            {user.enrolledCourses?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">Enrolled Courses:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {user.enrolledCourses.map((course, index) => (
                    <li key={index} className="text-sm">
                      {course.courseTitle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllUsers;
