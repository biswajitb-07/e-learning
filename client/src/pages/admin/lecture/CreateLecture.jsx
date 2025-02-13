import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../components/UI/Loader";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "../../../features/api/courseApi";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error("Error while refetching:", error);
      }
    };
  
    fetchData();
  }, []);  

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 mx-4 my-16">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lecture, add some basic details for your new lecture
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
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Create your lecture"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div></div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-300 hover:bg-gray-200"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </button>
          <button
            disabled={isLoading}
            onClick={createLectureHandler}
            className="px-4 py-2 text-white bg-[#309255] rounded-md hover:opacity-85 disabled:bg-[#309255] flex items-center cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </button>
        </div>
      </div>

      <div className="mt-10">
        {lectureLoading ? (
          <>
            <Loader />
            <p>lecture loading...</p>
          </>
        ) : lectureError ? (
          <p>Failed to load lectures.</p>
        ) : lectureData.lectures.length === 0 ? (
          <p>No Lectures available</p>
        ) : (
          lectureData?.lectures.map((lecture, index) => (
            <Lecture
              key={lecture._id}
              lecture={lecture}
              courseId={courseId}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
