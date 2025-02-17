import React, { useEffect, useState } from "react";
import {
  useAdminRequestMutation,
  useDeleteAdminRequestMutation,
  useGetRequestQuery,
} from "../../features/api/authApi";
import Loader from "../../components/UI/Loader";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

const AdminRequest = () => {
  const [file, setFile] = useState(null);

  const { data, isError, refetch } = useGetRequestQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [
    adminRequest,
    {
      data: adminRequestData,
      isSuccess: requestIsSuccess,
      isLoading: requestIsLoading,
      isError: requestIsError,
    },
  ] = useAdminRequestMutation();

  const [
    deleteRequest,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      isLoading: deleteIsLoading,
    },
  ] = useDeleteAdminRequestMutation();

  useEffect(() => {
    if (requestIsSuccess) {
      toast.success(
        adminRequestData?.message || "Admin request submitted successfully!"
      );
      setFile(null);
    } else if (requestIsError) {
      toast.error("Admin request failed");
    }
  }, [requestIsSuccess, requestIsError, adminRequestData, refetch]);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Admin request deleted successfully!");
      refetch();
    } else if (deleteIsError) {
      toast.error("Delete request failed");
    }
  }, [deleteIsSuccess, deleteIsError, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your resume!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await adminRequest(formData).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit request.");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteRequest().unwrap();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete request.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-full max-w-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-green-700 text-center">
          Admin Request
        </h2>
        <p className="text-gray-600 text-center mt-2">
          {data?.userRequest
            ? "Your request"
            : "Submit a request to become an admin."}
        </p>

        {isError && (
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-gray-700 font-medium">
              Upload your resume in PDF (less than 10MB)
            </label>

            <input
              type="file"
              accept="application/pdf"
              className="border w-full px-2 py-2 mt-2 rounded-md"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg mt-4 transition duration-300 flex justify-center items-center cursor-pointer"
              disabled={requestIsLoading}
            >
              {requestIsLoading ? <Loader /> : "Submit Request"}
            </button>
          </form>
        )}

        {data?.userRequest && !isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800">
                    {data.username || "Biswa"}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={data?.userRequest?.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download Resume
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {data?.userRequest?.status || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Request Button */}
        <div className="mt-4">
          <button
            onClick={handleDeleteRequest}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex justify-center items-center cursor-pointer"
            disabled={deleteIsLoading || !data?.userRequest}
          >
            {deleteIsLoading ? (
              <Loader />
            ) : (
              <>
                <AiOutlineDelete className="mr-2" /> Delete Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRequest;
