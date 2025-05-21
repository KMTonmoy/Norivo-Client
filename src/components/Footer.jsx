import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="text-2xl font-bold text-[#3bb77e]">Norivo</div>

        {/* Links */}
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#home" className="hover:text-white transition">
            Home
          </a>
          <a href="#categories" className="hover:text-white transition">
            Categories
          </a>
          <a href="#offers" className="hover:text-white transition">
            Offers
          </a>
          <a href="#blog" className="hover:text-white transition">
            Blog
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-5 text-lg">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3bb77e] transition"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3bb77e] transition"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3bb77e] transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3bb77e] transition"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-6">
        © 2025 Norivo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
