import React, { useState, useEffect } from "react";
import Loader from "../../components/UI/Loader";
import Course from "../student/Course";
import { toast } from "react-toastify";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "../../features/api/authApi";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading: isUserLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    { isLoading: isUpdateLoading, error, isError, isSuccess },
  ] = useUpdateUserMutation();

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    }
    if (isError) {
      toast.error(error.data.message || "Failed to update profile");
    }
  }, [error, isSuccess, updateUser, isError]);

  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

  const user = data && data.user;

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto px-4 my-24">
        <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
          <div className="flex flex-col items-center">
            {user && user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border"
              />
            ) : (
              <FaUserCircle size={80} />
            )}
          </div>
          <div>
            <p className="font-semibold">
              Name: <span className="font-normal ml-2">{user?.name}</span>
            </p>
            <p className="font-semibold">
              Email: <span className="font-normal ml-2">{user?.email}</span>
            </p>
            <p className="font-semibold">
              Role:{" "}
              <span className="font-normal ml-2">
                {user?.role.toUpperCase()}
              </span>
            </p>
            <button
              onClick={handleEditProfile}
              className="mt-3 bg-[#309255] text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center shadow-2xl z-40 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <p className="text-sm text-gray-600">
                Make changes to your profile here. Click save when you're done.
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  className="w-full border border-gray-300 p-2 rounded-md mt-1"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Profile Photo
                </label>
                <input
                  onChange={onChangeHandler}
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 p-2 rounded-md mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className={`px-4 py-2 rounded-lg flex items-center transition ${
                    isUpdateLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#309255] text-white cursor-pointer hover:opacity-85"
                  }`}
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? (
                    <>
                      Saving... <Loader />
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          <h1 className="font-medium text-2xl">Courses you're enrolled in</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
            {user?.enrolledCourses.length === 0 ? (
              <h1>You haven't enrolled yet</h1>
            ) : (
              user?.enrolledCourses.map((course) => (
                <Course key={course._id} course={course} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-24 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded w-1/3 mt-3"></div>
        </div>
      </div>
      <div className="mt-16">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="h-40 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
