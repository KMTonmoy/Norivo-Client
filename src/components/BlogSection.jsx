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
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://norivo-backend.vercel.app/blogs")
      .then((res) => {
        let data = res.data;
        // Shuffle the array randomly (Fisher-Yates)
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
        // Limit to max 6 blogs
        setBlogs(data.slice(0, 6));
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
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : (
        <>
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {blogs.map(({ _id, title, excerpt, image, date }) => {
              const truncatedTitle = truncateTitle(title, 50);
              const truncatedExcerpt = truncateExcerpt(excerpt, 120);

              return (
                <motion.article
                  key={_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow flex flex-col"
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <time
                      dateTime={date}
                      className="block text-xs text-gray-400 mb-2"
                    >
                      {new Date(date).toLocaleDateString()}
                    </time>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {truncatedTitle}
                    </h3>
                    <p className="text-gray-700 text-sm flex-grow">
                      {truncatedExcerpt}
                    </p>
                    <button
                      onClick={() => router.push(`/blog/${_id}`)}
                      className="mt-4 px-4 py-2 border-2 border-[#3BB77E] text-[#3BB77E] rounded-md font-semibold hover:bg-[#3BB77E] hover:text-white transition"
                      type="button"
                    >
                      Read Now
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => router.push("/blog")}
              className="px-8 py-3 border-2 border-[#3bb77e] text-[#3bb77e] rounded-md font-semibold hover:bg-[#3bb77e] hover:text-white transition"
              type="button"
            >
              View All Blogs
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default BlogSection;
