import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "../../features/api/courseProgressApi";
import Loader from "../../components/UI/Loader";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
    }
    if (inCompletedSuccess) {
      refetch();
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );
  if (isError) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) =>
    progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 my-20">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">{courseTitle}</h1>
        <button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          className={`px-4 py-2 rounded font-semibold transition duration-200 cursor-pointer ${
            completed
              ? "border border-gray-500 bg-black text-white "
              : "bg-black text-white"
          }`}
        >
          {completed ? (
            <div className="flex items-center">
              <FaCheckCircle className="h-4 w-4 mr-2 text-green-500" />{" "}
              Completed
            </div>
          ) : (
            "Mark as completed"
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 rounded-lg shadow-lg p-4">
          <video
            src={currentLecture?.videoUrl || initialLecture.videoUrl}
            controls
            className="w-full h-auto rounded-lg"
            onPlay={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
          />
          <h3 className="font-medium text-lg mt-2">
            {`Lecture ${
              courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
            }: ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`}
          </h3>
        </div>

        <div className="flex flex-col w-full lg:w-1/3 border-t lg:border-l border-gray-200 lg:pl-4 pt-4 lg:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <div
                key={lecture._id}
                className={`p-4 mb-3 border rounded-lg cursor-pointer transition ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <FaCheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <FaRegCirclePlay className="text-gray-500 mr-2" />
                    )}
                    <span className="text-lg font-medium">
                      {lecture.lectureTitle}
                    </span>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-200 rounded-lg">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
