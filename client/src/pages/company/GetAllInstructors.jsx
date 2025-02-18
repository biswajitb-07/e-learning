import React from "react";
import { useGetAllInstructorQuery } from "../../features/api/companyApi";
import Loader from "../../components/UI/Loader";
import { Link } from "react-router-dom";

const GetAllinstructors = () => {
  const { data, isLoading, error } = useGetAllInstructorQuery();

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500">
        Error fetching instructors!
      </div>
    );

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-2xl font-bold mb-6 text-center">Instructors list</h1>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 ">
        {data?.instructors?.map((user) => (
          <Link to={`/company/instructor/${user._id}/courses`}>
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
                className={`block text-center text-sm text-white px-3 py-1 rounded-full w-fit mx-auto my-2 bg-amber-500`}
              >
                {user.role}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GetAllinstructors;
