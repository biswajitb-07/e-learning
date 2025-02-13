import { useGetCourseDetailWithStatusQuery } from "../../features/api/purchaseApi";

import { useParams, Navigate } from "react-router-dom";
import Loader from "./Loader";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <Loader />;

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};
export default PurchaseCourseProtectedRoute;
