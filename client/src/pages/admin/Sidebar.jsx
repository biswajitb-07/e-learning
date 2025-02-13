import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { IoStatsChartSharp } from "react-icons/io5";
import { MdClose, MdDashboard, MdMenu } from "react-icons/md";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Sidebar for Large Devices */}
      <div className="hidden md:block w-[250px] space-y-8 border-r border-gray-300 p-5 sticky top-0 h-screen bg-[#212832]">
        <div className="mt-20 space-y-4">
          {/* Dashboard Link */}
          <Link
            to="dashboard"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/admin/dashboard") ? "text-green-500" : "text-white"
            }`}
          >
            <MdDashboard size={19} className="text-current" />
            <h1 className="text-lg font-medium">Dashboard</h1>
          </Link>
          {/* Courses Link */}
          <Link
            to="course"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/admin/course") ? "text-green-500" : "text-white"
            }`}
          >
            <IoStatsChartSharp size={19} className="text-current" />
            <h1 className="text-lg font-medium">Courses</h1>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden h-screen w-12 bg-[#212832] sticky top-0 flex flex-col items-center">
        <button onClick={toggleMobileMenu} className="mt-20">
          {!isMobileMenuOpen && (
            <MdMenu
              size={26}
              className="text-white hover:text-green-600 cursor-pointer"
            />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-[18rem] bg-[#0f1114] text-white transform transition-transform duration-300 ease-in-out z-20 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end pr-3">
          <button
            onClick={toggleMobileMenu}
            className="mt-2 cursor-pointer transition-all ease-in-out duration-200 hover:rotate-180 hover:bg-green-900"
          >
            <MdClose size={26} className="text-white" />
          </button>
        </div>

        <div className="space-y-4 flex flex-col px-5 mt-5">
          {/* Dashboard Link */}
          <Link
            onClick={toggleMobileMenu}
            to="dashboard"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/admin/dashboard") ? "text-green-500" : "text-white"
            }`}
          >
            <MdDashboard size={19} className="text-current" />
            <h1 className="text-lg font-medium">Dashboard</h1>
          </Link>
          {/* Courses Link */}
          <Link
            onClick={toggleMobileMenu}
            to="course"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/admin/course") ? "text-green-500" : "text-white"
            }`}
          >
            <IoStatsChartSharp size={19} className="text-current" />
            <h1 className="text-lg font-medium">Courses</h1>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
