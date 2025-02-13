import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "../../../features/api/courseApi";
import RichTextEditor from "../../../components/UI/RichTextEditor";
import Loader from "../../../components/UI/Loader";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [publishCourse] = usePublishCourseMutation();
  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (courseByIdData?.course) {
        const course = courseByIdData.course;
        setInput({
          courseTitle: course.courseTitle,
          subTitle: course.subTitle,
          description: course.description,
          category: course.category,
          courseLevel: course.courseLevel,
          coursePrice: course.coursePrice,
          courseThumbnail: "",
        });
      }
    };
    fetchCourseData();
  }, [courseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setInput((prevInput) => ({ ...prevInput, courseThumbnail: file }));
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated successfully.");
    } else if (error) {
      toast.error(error?.data?.message || "Failed to update course.");
    }
  }, [isSuccess, error, data]);

  if (courseByIdLoading) {
    return (
      <>
        <div className="h-screen w-full grid place-items-center">
          <Loader />
        </div>
        <p>Please wait...</p>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Basic Course Information</h2>
          <p className="text-gray-500">Update your course details below.</p>
        </div>
        <div className="space-x-2 mt-3 md:mt-0">
          <button
            disabled={courseByIdData?.course.lectures.length === 0}
            className="px-4 py-2 bg-[#309255] hover:opacity-85 cursor-pointer text-white rounded-md disabled:bg-[#309255]"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button className="px-4 py-2 bg-red-600 hover:opacity-85 cursor-pointer text-white rounded-md">
            Remove Course
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="courseTitle"
            value={input.courseTitle}
            onChange={changeEventHandler}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Subtitle</label>
          <input
            type="text"
            name="subTitle"
            value={input.subTitle}
            onChange={changeEventHandler}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Category</label>
            <select
              value={input.category}
              onChange={(e) => selectCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a category</option>
              <option value="Next JS">Next JS</option>
              <option value="Data Science">Data Science</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Fullstack Development">
                Fullstack Development
              </option>
              <option value="MERN Stack Development">
                MERN Stack Development
              </option>
              <option value="Javascript">Javascript</option>
              <option value="React JS">React JS</option>
              <option value="Python">Python</option>
              <option value="Docker">Docker</option>
              <option value="MongoDB">MongoDB</option>
              <option value="HTML">HTML</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Course Level</label>
            <select
              value={input.courseLevel}
              onChange={(e) => selectCourseLevel(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select course level</option>
              <option value="Beginner">Beginner</option>
              <option value="Medium">Medium</option>
              <option value="Advance">Advance</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Price (INR)</label>
            <input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Course Thumbnail</label>
          <input
            type="file"
            onChange={selectThumbnail}
            accept="image/*"
            className="w-full p-2 border rounded-md"
          />
          {previewThumbnail && (
            <img
              src={previewThumbnail}
              className="mt-2 w-64"
              alt="Course Thumbnail"
            />
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/admin/course")}
            className="px-4 py-2 border rounded-md bg-red-500 hover:opacity-85 text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={updateCourseHandler}
            className="px-4 py-2 bg-[#309255] hover:opacity-85 cursor-pointer text-white rounded-md flex items-center"
          >
            {isLoading && <Loader />} Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseTab;
