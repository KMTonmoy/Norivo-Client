"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRegNewspaper } from "react-icons/fa";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const truncate = (text = "", max = 100) =>
  text.length <= max ? text : text.slice(0, max).trim() + "...";

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md animate-pulse overflow-hidden">
    <div className="h-48 bg-gray-300" />
    <div className="p-5 space-y-4">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2 mt-6"></div>
    </div>
  </div>
);

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://norivo-backend.vercel.app/blogs")
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
      <motion.div
        className="flex items-center justify-center mb-10 gap-2"
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <FaRegNewspaper className="text-[#3bb77e] text-3xl" />
        <h2 className="text-3xl font-bold text-[#3bb77e]">Latest Blogs</h2>
      </motion.div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Show 6 skeleton cards */}
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {blogs.map(({ _id, title, excerpt, image, date }) => (
            <motion.article
              key={_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <time
                    dateTime={date}
                    className="block text-xs text-gray-400 mb-2"
                  >
                    {new Date(date).toLocaleDateString()}
                  </time>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {truncate(title, 50)}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    {truncate(excerpt, 120)}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/blog/details/${_id}`)}
                  className="mt-auto inline-block text-sm text-white bg-[#3bb77e] hover:bg-[#2da164] py-2 px-4 rounded transition duration-300"
                >
                  Read Now
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default BlogsPage;
