"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full z-50 text-sm text-gray-600 ${
        isSticky ? "fixed top-0 shadow-md bg-white" : "bg-[#F3F3F3]"
      }`}
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
          <a href="/login" className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition">
            <User className="w-5 h-5" />
            <span className="hidden md:block">Account</span>
          </a>
          <a href="/cart" className="flex flex-col items-center text-xs hover:text-[#3BB77E] transition">
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden md:block">Cart</span>
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white shadow-sm"
      >
        <div className="w-full px-4 md:px-10 py-3 flex flex-wrap items-center justify-start gap-6 overflow-x-auto whitespace-nowrap text-sm font-medium">
          <Link href="/" className="hover:text-[#3BB77E] transition">
            Home
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#3BB77E] transition">
              Categories <ChevronDown size={16} />
            </button>
            {showMegaMenu && (
              <div className="absolute top-full left-0 bg-white border shadow-lg rounded-md mt-2 p-4 w-[600px] grid grid-cols-3 gap-6 z-50">
                <div>
                  <h4 className="font-semibold mb-2">Fashion</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><Link href="#">Men</Link></li>
                    <li><Link href="#">Women</Link></li>
                    <li><Link href="#">Kids</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Electronics</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><Link href="#">Mobiles</Link></li>
                    <li><Link href="#">Laptops</Link></li>
                    <li><Link href="#">Accessories</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Home</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><Link href="#">Furniture</Link></li>
                    <li><Link href="#">Kitchen</Link></li>
                    <li><Link href="#">Decor</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <Link href="/products" className="hover:text-[#3BB77E] transition">
            Products
          </Link>
          <Link href="/blog" className="hover:text-[#3BB77E] transition">
            Blog
          </Link>
          <Link href="/pages" className="hover:text-[#3BB77E] transition">
            Pages
          </Link>
          <Link href="/offers" className="hover:text-[#3BB77E] transition">
            Offers
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
