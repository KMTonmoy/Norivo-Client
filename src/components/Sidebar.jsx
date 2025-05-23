"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  FaHome,
  FaUserCircle,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTags,
  FaNewspaper,
  FaBoxOpen,
  FaMoneyBillWave,
  FaThLarge,
  FaImage,
  FaPlusCircle,
} from "react-icons/fa";
import Link from "next/link";
import { AuthContext } from "../Provider/AuthProvider";
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const { user, logOut } = useContext(AuthContext);
  const email = user?.email || "";
  const role = data?.role;

  useEffect(() => {
    if (email) {
      fetch(`https://norivo-backend.vercel.app/users/${email}`)
        .then((res) => res.json())
        .then(setData)
        .catch(() => setData(null));
    }
  }, [email]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const commonLinks = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { name: "Profile", icon: <FaUserCircle />, path: "/dashboard/profile" },
    { name: "Settings", icon: <FaCogs />, path: "/dashboard/settings" },
    { name: "My Orders", icon: <FaBoxOpen />, path: "/dashboard/myorders" },
  ];

  const adminLinks = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    {
      name: "Customize Banner",
      icon: <FaImage />,
      path: "/dashboard/CustomizeBanner",
    },
    {
      name: "Add Product",
      icon: <FaPlusCircle />,
      path: "/dashboard/addproduct",
    },
    {
      name: "Manage Products",
      icon: <FaBoxOpen />,
      path: "/dashboard/products",
    },
    {
      name: "Add Coupon",
      icon: <FaMoneyBillWave />,
      path: "/dashboard/AddCoupon",
    },
    {
      name: "Manage Coupons",
      icon: <FaTags />,
      path: "/dashboard/ManageCoupon",
    },
    {
      name: "Manage Categories",
      icon: <FaThLarge />,
      path: "/dashboard/categories",
    },
    {
      name: "Manage Blogs",
      icon: <FaNewspaper />,
      path: "/dashboard/manageblogs",
    },
  ];

  const links = role === "admin" ? adminLinks : commonLinks;

  const Skeleton = () => (
    <div className="animate-pulse flex flex-col h-full bg-gray-900 text-white w-64 p-5">
      <div className="flex items-center space-x-4 mb-6">
        <div className="rounded-full bg-gray-700 h-12 w-12" />
        <div className="flex flex-col space-y-2 w-full">
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="flex-1 space-y-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-700 rounded w-full mx-3" />
        ))}
      </div>
      <div className="mt-6">
        <div className="h-10 bg-gray-700 rounded w-full mx-3" />
      </div>
    </div>
  );

  if (!data) {
    return <Skeleton />;
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <div className="flex">
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-gray-900 rounded-md text-white shadow-lg hover:bg-gray-700 transition"
          aria-label="Toggle sidebar"
        >
          <FaBars size={24} />
        </button>

        <aside
          className={`
            fixed top-0 left-0 h-full min-h-screen w-64 bg-gray-900 text-white
            z-50 transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:shadow-none flex flex-col
          `}
          aria-label="Sidebar Navigation"
        >
          <div className="relative flex items-center space-x-4 p-5 bg-gray-800 border-b border-gray-700">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover border-2 border-blue-600"
            />
            <div>
              <h2 className="text-lg font-semibold truncate max-w-[10rem]">
                {user?.displayName || "User"}
              </h2>
              <p className="text-sm text-gray-400 truncate max-w-[10rem]">
                Role: <span className="capitalize">{role || "User"}</span>
              </p>
            </div>
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 lg:hidden text-white"
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto mt-4">
            {links.map(({ name, icon, path }) => (
              <Link
                key={name}
                href={path}
                className="flex items-center space-x-4 py-3 px-6 hover:bg-gray-700 transition rounded-lg mx-3 my-1 transform hover:scale-[1.03]"
              >
                <span className="text-xl">{icon}</span>
                <span className="font-medium">{name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-700">
            <button
              onClick={logOut}
              className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 rounded-lg py-3 w-full text-white font-semibold transition"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
