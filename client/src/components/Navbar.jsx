import React, { useEffect, useState } from "react";
import { FaBookOpen, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogoutUserMutation } from "../features/api/authApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.error(data.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-16 bg-[#EEFBF3] border-b border-b-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl h-full mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <FaBookOpen size={24} className="text-[#309255]" />
            <h1 className="font-extrabold text-xl text-[#309255] md:text-2xl">
              Tech Star
            </h1>
          </div>
        </Link>

        {/* Buttons / Dropdown */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <MdClose
                  size={26}
                  className="text-[#309255] transition-all duration-200 hover:rotate-90 cursor-pointer font-bold"
                />
              ) : (
                <div className="flex items-center justify-center">
                  {user && user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md"
                    />
                  ) : (
                    <FaUserCircle size={24} />
                  )}
                </div>
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  {user && user?.photoUrl ? (
                    <div className="flex items-center justify-center">
                      <img
                        src={user.photoUrl}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md"
                      />
                    </div>
                  ) : (
                    <FaUserCircle size={30} />
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 md:w-48 bg-white rounded-lg shadow-lg">
                    <div className="p-3">
                      <p
                        onClick={toggleDropdown}
                        className={`font-bold text-sm hover:bg-gray-100 cursor-pointer`}
                      >
                        My Account
                      </p>
                    </div>
                    <ul className="border-t border-gray-200">
                      <Link to="/my-learning">
                        <li
                          onClick={toggleDropdown}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                            isActive("/my-learning") ? "text-green-500" : ""
                          }`}
                        >
                          My Learning
                        </li>
                      </Link>
                      <Link to="/profile">
                        <li
                          onClick={toggleDropdown}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                            isActive("/profile") ? "text-green-500" : ""
                          }`}
                        >
                          Edit Profile
                        </li>
                      </Link>
                      <li
                        onClick={() => {
                          logoutHandler();
                          toggleDropdown();
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      >
                        <FaSignOutAlt />
                        Log out
                      </li>
                    </ul>
                    {user.role === "student" && (
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            toggleDropdown();
                            navigate("/admin-request");
                          }}
                          className="w-full px-4 py-2 text-center bg-[#309255] text-white rounded-b-lg hover:opacity-80 cursor-pointer"
                        >
                          Admin Request
                        </button>
                      </div>
                    )}
                    {user.role === "company" && (
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            toggleDropdown();
                            navigate("/company");
                          }}
                          className="w-full px-4 py-2 text-center bg-[#309255] text-white rounded-b-lg hover:opacity-80 cursor-pointer"
                        >
                          Company
                        </button>
                      </div>
                    )}
                    {user.role === "instructor" && (
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            toggleDropdown();
                            navigate("/admin");
                          }}
                          className="w-full px-4 py-2 text-center bg-[#309255] text-white rounded-b-lg hover:opacity-80 cursor-pointer"
                        >
                          Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="px-4 py-2 bg-[#309255] text-white text-sm rounded-lg hover:opacity-90 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-[18rem] bg-[#0f1114] text-white transform transition-transform duration-300 ease-in-out z-20 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="p-4 flex flex-col gap-3">
          <Link>
            <li
              onClick={toggleMobileMenu}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold `}
            >
              My Account
            </li>
          </Link>

          {user ? (
            <>
              <Link to="/my-learning">
                <li
                  onClick={toggleMobileMenu}
                  className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                    isActive("/my-learning") ? "bg-gray-700" : ""
                  }`}
                >
                  My Learning
                </li>
              </Link>
              <Link to="/profile">
                <li
                  onClick={toggleMobileMenu}
                  className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                    isActive("/profile") ? "bg-gray-700" : ""
                  }`}
                >
                  Edit Profile
                </li>
              </Link>
              <li
                onClick={() => {
                  logoutHandler();
                  toggleMobileMenu();
                }}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              >
                <FaSignOutAlt />
                Log out
              </li>
              {user.role === "student" && (
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    navigate("/admin-request");
                  }}
                  className="w-full px-4 py-2 text-center bg-[#309255] text-white rounded-lg hover:opacity-80 cursor-pointer"
                >
                  Admin request
                </button>
              )}
              {user.role === "company" && (
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    navigate("/company");
                  }}
                  className="w-full px-4 py-2 text-center bg-[#309255] text-white rounded-lg hover:opacity-80 cursor-pointer"
                >
                  Company
                </button>
              )}
              {user.role === "instructor" && (
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    navigate("/admin");
                  }}
                  className="w-full px-4 py-2 text-center bg-[#309255] text-white rounded-lg hover:opacity-80 cursor-pointer"
                >
                  Dashboard
                </button>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4 mt-5 p-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    toggleMobileMenu();
                  }}
                  className="px-4 py-2 bg-[#309255] text-white text-sm rounded-lg hover:opacity-90 cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/register");
                    toggleMobileMenu();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
