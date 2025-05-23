"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByLatest, setSortByLatest] = useState(false);

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

  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(lowerSearch) ||
          blog.excerpt.toLowerCase().includes(lowerSearch)
      );
    }

    if (sortByLatest) {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    return filtered;
  }, [blogs, searchTerm, sortByLatest]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 w-full mx-auto  ">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3bb77e]"
        />
        <button
          onClick={() => setSortByLatest((prev) => !prev)}
          className="px-6 py-2 border-2 border-[#3bb77e] text-[#3bb77e] rounded-md font-semibold hover:bg-[#3bb77e] hover:text-white transition"
          type="button"
          aria-pressed={sortByLatest}
        >
          {sortByLatest ? "Normal Order" : "Sort by Latest"}
        </button>
      </div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500 mt-16 text-lg">
          No blogs found matching your search.
        </p>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ gridAutoRows: "1fr" }}
        >
          <AnimatePresence>
            {filteredBlogs.map(({ _id, title, excerpt, image, date }) => (
              <motion.article
                key={_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                layout
                style={{ minHeight: "380px" }}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-5 flex flex-col justify-between flex-grow">
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
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default BlogsPage;
