import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MdClose, MdMenu } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

const CompanySidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-[250px] space-y-8 border-r border-gray-300 p-5 sticky top-0 h-screen bg-[#212832]">
        <div className="mt-20 space-y-4">
          <Link
            to="users"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/company/users") ? "text-green-500" : "text-white"
            }`}
          >
            <FaRegUser size={19} className="text-current" />
            <h1 className="text-lg font-medium">Users</h1>
          </Link>
          <Link
            to="instructors"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/company/instructors") ? "text-green-500" : "text-white"
            }`}
          >
            <FaChalkboardTeacher size={19} className="text-current" />
            <h1 className="text-lg font-medium">Instructors</h1>
          </Link>
          <Link
            to="admin-request"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/company/admin-request")
                ? "text-green-500"
                : "text-white"
            }`}
          >
            <VscGitPullRequestGoToChanges size={19} className="text-current" />
            <h1 className="text-lg font-medium">Admin request</h1>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden h-screen w-0 sticky top-0 flex flex-col ml-4">
        <button onClick={toggleMobileMenu} className="mt-16">
          {!isMobileMenuOpen && (
            <MdMenu
              size={26}
              className="text-black hover:text-green-600 cursor-pointer"
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
          <Link
            onClick={toggleMobileMenu}
            to="users"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/company/users") ? "text-green-500" : "text-white"
            }`}
          >
            <FaRegUser size={19} className="text-current" />
            <h1 className="text-lg font-medium">Users</h1>
          </Link>
          <Link
            onClick={toggleMobileMenu}
            to="instructors"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/company/instructors") ? "text-green-500" : "text-white"
            }`}
          >
            <FaChalkboardTeacher size={19} className="text-current" />
            <h1 className="text-lg font-medium">Instructors</h1>
          </Link>
          <Link
            onClick={toggleMobileMenu}
            to="admin-request"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-500 ${
              isActive("/company/admin-request")
                ? "text-green-500"
                : "text-white"
            }`}
          >
            <VscGitPullRequestGoToChanges size={19} className="text-current" />
            <h1 className="text-lg font-medium">Admin request</h1>
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

export default CompanySidebar;
