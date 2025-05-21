"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRegNewspaper } from "react-icons/fa";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const truncateTitle = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

const truncateExcerpt = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "... Read More";
};

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/blogs.json")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 w-full mx-auto">
      <div className="flex items-center justify-center mb-10 gap-2">
        <FaRegNewspaper className="text-[#3bb77e] text-3xl" />
        <h2 className="text-3xl font-bold text-[#3bb77e]">Latest Blogs</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map(({ _id, title, excerpt, image, date }) => {
            const truncatedTitle = truncateTitle(title, 50);
            const truncatedExcerpt = truncateExcerpt(excerpt, 120);

            return (
              <motion.article
                key={_id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <time
                    dateTime={date}
                    className="block text-xs text-gray-400 mb-2"
                  >
                    {new Date(date).toLocaleDateString()}
                  </time>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {truncatedTitle}
                  </h3>
                  <p className="text-gray-700 text-sm">{truncatedExcerpt}</p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default BlogSection;
