import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "../../../features/api/courseApi";
import Loader from "../../../components/UI/Loader";

const MEDIA_API = "https://e-learning-sryx.onrender.com/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const { courseId, lectureId } = params;
  const navigate = useNavigate();

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    try {
      await removeLecture(lectureId);
    } catch (error) {
      toast.error(error.data?.message || "Failed to remove lecture");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      navigate(-1);
    } else if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.error(removeData.message);
      navigate(-1);
    }
  }, [removeSuccess]);

  return (
    <div className="border rounded-md shadow-md p-4 sm:p-6 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold text-gray-800">Edit Lecture</h2>
          <p className="text-sm text-gray-600">
            Make changes and click save when done.
          </p>
        </div>
        <button
          disabled={removeLoading}
          onClick={removeLectureHandler}
          className={`px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer`}
        >
          {removeLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader />
              Please wait
            </div>
          ) : (
            "Remove Lecture"
          )}
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-700 font-bold">Title:</label>
        <input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          placeholder="Ex. Introduction to Javascript"
          className="mt-1 block w-full rounded-md outline shadow-sm focus:ring-[#309255] focus:border-[#309255] p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Video <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={fileChangeHandler}
          className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-[#309255] focus:border-[#309255] outline p-2"
        />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={isFree}
          onChange={() => setIsFree(!isFree)}
          className="rounded border-gray-300 shadow-sm cursor-pointer accent-[#309255]"
        />
        <label className="text-sm text-gray-700">Is this video FREE</label>
      </div>
      {mediaProgress && (
        <div className="mb-4">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-[#309255] transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
        </div>
      )}
      <button
        disabled={isLoading || btnDisable}
        onClick={editLectureHandler}
        className="px-4 py-2 text-white bg-[#309255] rounded-md hover:opacity-85 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            Please wait
          </div>
        ) : (
          "Update Lecture"
        )}
      </button>
    </div>
  );
};

export default LectureTab;
