import React, { useEffect, useState } from "react";
import {
  useDeleteInstructorMutation,
  useGetAllInstructorQuery,
} from "../../features/api/companyApi";
import Loader from "../../components/UI/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const GetAllinstructors = () => {
  const { data, isLoading, error } = useGetAllInstructorQuery();
  const [deleteInstructor, { isSuccess }] = useDeleteInstructorMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const deleteInstructorHandle = async (userId) => {
    setLoadingUserId(userId);
    try {
      await deleteInstructor(userId).unwrap();
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setLoadingUserId(null);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Instructor delete successful");
    }
  }, [isSuccess]);

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
              className="relative bg-white shadow-lg rounded-lg p-5 border transition-all duration-150 ease-linear hover:scale-95 hover:shadow-green-400"
            >
              {/* Delete Icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteInstructorHandle(user._id);
                }}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 cursor-pointer"
                disabled={loadingUserId === user._id}
              >
                {loadingUserId === user._id ? (
                  <Loader />
                ) : (
                  <FaTrash size={20} />
                )}
              </button>

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

      {data.instructors.length === 0 && (
        <div className="grid place-items-center">
          <h1 className="text-red-500 font-bold text-2xl">
            No Instructor found!
          </h1>
        </div>
      )}
    </div>
  );
};

export default GetAllinstructors;
