import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useGetCourseDetailWithStatusQuery } from "../../features/api/purchaseApi";
import BuyCourseButton from "../../components/UI/BuyCourseButton";
import { FaLock, FaPlayCircle } from "react-icons/fa";
import Loader from "../../components/UI/Loader";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isSuccess, isLoading, isError, refetch } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );
  if (isError) return <h1>Failed to load course details</h1>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-5 my-20">
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">Course Sub-title</p>
          <p>
            Created By{" "}
            <span className="text-blue-400 underline italic">
              {course?.creator?.name || "Unknown"}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <p>Last updated {course?.createdAt?.split("T")[0] || "N/A"}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: course?.description || "No description available.",
            }}
          />
          <div className="border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="font-semibold text-lg">Course Content</h2>
              <p className="text-sm text-gray-600">
                {course?.lectures?.length || 0} lectures
              </p>
            </div>
            <div className="space-y-3">
              {course?.lectures?.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {lecture?.isPreviewFree && purchased ? (
                      <FaPlayCircle size={16} />
                    ) : (
                      <FaLock size={16} />
                    )}
                  </span>
                  <p>{lecture?.lectureTitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="w-full aspect-video mb-4">
                {course?.lectures?.length > 0 ? (
                  <div>
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={course.lectures[0].videoUrl}
                      controls
                    />
                    <p className="pt-3 font-bold text-lg">
                      {course.lectures[0].lectureTitle}
                    </p>
                  </div>
                ) : (
                  <p className="text-center">No preview available</p>
                )}
              </div>
              <h1 className="text-lg font-semibold">
                Course Price: ₹{course?.coursePrice || "N/A"}
              </h1>
            </div>
            <div className="p-4">
              {purchased ? (
                <button
                  onClick={handleContinueCourse}
                  className="w-full bg-[#309255] text-white py-2 px-4 rounded hover:opacity-85 cursor-pointer"
                >
                  Continue Course
                </button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
