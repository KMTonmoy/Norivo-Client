"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/Provider/AuthProvider";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [megaMenuPos, setMegaMenuPos] = useState({ left: 0, top: 0, width: 0 });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const triggerRef = useRef(null);
  const megaMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const pathName = usePathname();
  const { user, logOut } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculateMegaMenuPos = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMegaMenuPos({
        left: rect.left,
        top: rect.bottom,
        width: rect.width,
      });
    }
  };

  const handleToggleMegaMenu = () => {
    if (!showMegaMenu) calculateMegaMenuPos();
    setShowMegaMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMegaMenu &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setShowMegaMenu(false);
      }

      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMegaMenu, showUserMenu]);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "Blog", href: "/blog" },
    { title: "Offers", href: "/offers" },
    { title: "Contact", href: "/contact" },
  ];

  const activeColor = "text-[#3BB77E]";
  const hoverColor = "hover:text-[#3BB77E]";
  console.log(user);
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full z-50 text-sm text-gray-600 relative ${
        isSticky ? "fixed top-0 shadow-md bg-white" : "bg-[#F3F3F3]"
      }`}
      style={{ overflow: "visible" }}
    >
      <div className="w-full px-4 md:px-10 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full justify-between md:w-auto md:justify-start">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-bold text-gray-800">
              <span className="text-[#3BB77E]">N</span>orivo
            </span>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <a href="/login" className="hover:text-[#3BB77E] transition">
              <User className="w-5 h-5" />
            </a>
            <a href="/cart" className="hover:text-[#3BB77E] transition">
              <ShoppingBag className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="w-full md:max-w-xl md:flex-grow">
          <div className="relative w-full md:w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition focus:outline-none"
              >
                <img
                  src={user?.photoURL}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full object-cover border-2 border-[#3BB77E]"
                />
                <span>Account</span>
              </button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50"
                >
                  <div className="p-3 border-b text-sm text-gray-700">
                    <p className="font-semibold truncate">{user.displayName}</p>
                    <p className="text-xs truncate text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <ul className="text-sm text-gray-700 divide-y">
                    <li>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <UserIcon size={16} />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logOut?.();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition"
            >
              <User className="w-5 h-5" />
              <span>Account</span>
            </a>
          )}

          <a
            href="/cart"
            className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Cart</span>
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white shadow-sm"
      >
        <div className="w-full px-4 md:px-10 py-3 flex flex-wrap items-center justify-start gap-6 overflow-x-auto whitespace-nowrap text-sm font-medium relative">
          {navLinks.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative pb-1 transition-colors duration-300 group ${
                pathName === href ? activeColor : hoverColor
              }`}
            >
              {title}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-[#3BB77E] transition-[width] duration-300 ${
                  pathName === href ? "w-full" : "w-0"
                } group-hover:w-full`}
              />
            </Link>
          ))}

          <div
            ref={triggerRef}
            onClick={handleToggleMegaMenu}
            className="relative cursor-pointer select-none group"
          >
            <button
              className={`flex items-center gap-1 pb-1 transition-colors duration-300 ${
                showMegaMenu ? activeColor : hoverColor
              }`}
            >
              Baby Collection <ChevronDown size={16} />
            </button>
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-[#3BB77E] transition-[width] duration-300 ${
                showMegaMenu ? "w-full" : "w-0"
              } group-hover:w-full`}
            />
          </div>
        </div>
      </motion.div>

      {showMegaMenu && (
        <div
          ref={megaMenuRef}
          className="fixed bg-white border shadow-lg rounded-md p-6 z-[10000]"
          style={{
            top: megaMenuPos.top + window.scrollY + 8,
            left: megaMenuPos.left,
            width: "min(90vw, 600px)",
            minWidth: 480,
            maxWidth: "calc(100vw - 2rem)",
            overflow: "visible",
          }}
        >
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Clothing</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <Link href="#">Newborn (0-6M)</Link>
                </li>
                <li>
                  <Link href="#">Toddlers (1-3Y)</Link>
                </li>
                <li>
                  <Link href="#">Kids (4-7Y)</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Toys</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <Link href="#">Soft Toys</Link>
                </li>
                <li>
                  <Link href="#">Learning Toys</Link>
                </li>
                <li>
                  <Link href="#">Outdoor Toys</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Essentials</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <Link href="#">Diapers</Link>
                </li>
                <li>
                  <Link href="#">Baby Bath</Link>
                </li>
                <li>
                  <Link href="#">Feeding Bottles</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;
