import React, { useState } from "react";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import {
  useDeleteAdminRequestMutation,
  useGetAllAdminRequestQuery,
  useUpdateAdminRequestMutation,
} from "../../features/api/companyApi";
import Loader from "../../components/UI/Loader";
import { toast } from "react-toastify";

const GetAllAdminRequest = () => {
  const { data, isLoading, isError, refetch } = useGetAllAdminRequestQuery();
  const [deleteAdminRequest] = useDeleteAdminRequestMutation();
  const [updateAdminRequest] = useUpdateAdminRequestMutation();
  const [editingRequest, setEditingRequest] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [userRole, setUserRole] = useState("");

  const deleteRequest = async (id) => {
    try {
      await deleteAdminRequest(id).unwrap();
      toast.success("Request deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete request");
    }
  };

  const updateRequest = async (id) => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }
    try {
      await updateAdminRequest({
        userId: id,
        status: newStatus,
        userRole,
      }).unwrap();
      toast.success("Status updated successfully");
      setEditingRequest(null);
      setNewStatus("");
      setUserRole("");
      refetch();
    } catch (error) {
      console.log(error);

      toast.error("Failed to update request");
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );

  if (isError) return <h1>Failed to get admin requests</h1>;

  return (
    <div className="p-4 my-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Requests</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {data?.request?.length > 0 ? (
          <ul className="divide-y divide-gray-500">
            {data?.request?.map((req) => (
              <li
                key={req._id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                  <span className="font-medium text-gray-700 flex-1">
                    {req.userId?.name || "Unknown"}
                  </span>
                  <a
                    href={req.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-1 text-center"
                  >
                    Resume
                  </a>
                  {editingRequest === req._id ? (
                    <>
                      <div className="flex gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="">Select Status</option>
                          <option value="pending">pending</option>
                          <option value="accepted">accepted</option>
                          <option value="successful">successful</option>
                          <option value="rejected">rejected</option>
                        </select>

                        <select
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="">Select Role</option>
                          <option value="instructor">instructor</option>
                          <option value="company">company</option>
                        </select>
                      </div>
                      <button
                        onClick={() => updateRequest(req.userId?._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded ml-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRequest(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded ml-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={`text-sm flex-1 text-center px-3 py-1 rounded font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : req.status === "accepted"
                          ? "bg-green-500 text-white"
                          : req.status === "successful"
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      disabled
                    >
                      {req.status}
                    </button>
                  )}
                  {editingRequest === req._id ? null : (
                    <button
                      onClick={() => setEditingRequest(req._id)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer flex-1 text-right"
                    >
                      <MdEdit size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteRequest(req._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer flex-1 text-right"
                  >
                    <MdDeleteForever size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-gray-500 text-center">
            No admin requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GetAllAdminRequest;
