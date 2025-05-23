"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/Provider/AuthProvider";

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
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
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      router.push(`/products?name=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={
          isSticky
            ? { y: 0, opacity: 1, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }
            : { y: 0, opacity: 1, boxShadow: "none" }
        }
        transition={{ type: "spring", stiffness: 120, damping: 20, duration: 0.3 }}
        className="w-full z-50 text-sm text-gray-600 bg-white fixed top-0 left-0 right-0 backdrop-blur-md bg-opacity-90 transition-shadow duration-300"
        style={{ height: 64 }}
      >
        <div className="w-full px-4 md:px-10 h-full flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full justify-between md:w-auto md:justify-start">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl font-bold text-gray-800">
                <span className="text-[#3BB77E]">N</span>orivo
              </span>
            </div>
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/login" className="hover:text-[#3BB77E] transition">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="hover:text-[#3BB77E] transition">
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="w-full md:max-w-xl md:flex-grow">
            <form
              onSubmit={handleSearch}
              className="relative w-full md:w-full sm:w-1/2"
              role="search"
              aria-label="Product search form"
            >
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                  aria-controls="user-menu"
                >
                  <img
                    src={user?.photoURL}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#3BB77E]"
                  />
                  <span>Account</span>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      id="user-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50"
                      role="menu"
                      aria-label="User account menu"
                    >
                      <div className="p-3 border-b text-sm text-gray-700">
                        <p className="font-semibold truncate">{user.displayName}</p>
                        <p className="text-xs truncate text-gray-500">{user.email}</p>
                      </div>
                      <ul className="text-sm text-gray-700 divide-y">
                        <li>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                            role="menuitem"
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                            role="menuitem"
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
                            role="menuitem"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition"
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Cart</span>
            </Link>
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

        <AnimatePresence>
          {showMegaMenu && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed bg-white border shadow-lg rounded-md p-6 z-[10000]"
              style={{
                top: megaMenuPos.top + window.scrollY + 8,
                left: megaMenuPos.left,
                minWidth: megaMenuPos.width,
                maxWidth: 400,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-1">Clothing</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Onesies & Rompers
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Tops & T-Shirts
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Pants & Leggings
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Dresses & Skirts
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-1">Accessories</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Hats & Caps
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Socks & Booties
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Blankets & Swaddles
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="hover:text-[#3BB77E]">
                        Bibs & Burp Cloths
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Navbar;
