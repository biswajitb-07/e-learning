import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetPurchasedCoursesQuery } from "../../features/api/purchaseApi";
import Loader from "../../components/UI/Loader";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  console.log(data);
  

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );
  if (isLoading)
    return <h1 className="text-red-500">Failed to get purchased course</h1>;

  const { purchasedCourses } = data || [];

  console.log(purchasedCourses);
  

  const courseData = purchasedCourses.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourses.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );
  const totalSales = purchasedCourses.length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-16">
      <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 bg-white rounded-lg">
        <h2 className="text-lg font-semibold">Total Sales</h2>
        <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
      </div>

      <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 bg-white rounded-lg">
        <h2 className="text-lg font-semibold">Total Revenue</h2>
        <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
      </div>

      {/* Course Prices Card */}
      <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <h2 className="text-xl font-semibold text-gray-700">Course Prices</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={courseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              angle={-30} // Rotated labels for better visibility
              textAnchor="end"
              interval={0} // Display all labels
            />
            <YAxis stroke="#6b7280" />
            <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4a90e2" // Changed color to a different shade of blue
              strokeWidth={3}
              dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
