"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const skeletonClasses = "bg-gray-300 rounded-md animate-pulse";

const BlogDetails = ({ params }) => {
  const { _id } = params;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_id) return;

    fetch(`http://localhost:8000/blogs/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [_id]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full p-6">
        {loading ? (
          <div className="space-y-4">
            <div className={`${skeletonClasses} w-3/4 h-8`}></div>
            <div className={`${skeletonClasses} w-1/4 h-4`}></div>
            <div className={`${skeletonClasses} w-full h-64 rounded-lg`}></div>
            <div className={`${skeletonClasses} w-full h-6`}></div>
            <div className={`${skeletonClasses} w-full h-6`}></div>
            <div className={`${skeletonClasses} w-5/6 h-6`}></div>
          </div>
        ) : blog ? (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-extrabold text-[#3bb77e]">{blog.title}</h1>
            <time dateTime={blog.date} className="block text-gray-400 text-sm">
              {new Date(blog.date).toLocaleDateString()}
            </time>
            <motion.img
              src={blog.image}
              alt={blog.title}
              className="rounded-lg shadow-md w-full h-80 object-cover"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              loading="lazy"
            />
            <p className="text-gray-700 text-lg whitespace-pre-line">{blog.excerpt}</p>
          </motion.article>
        ) : (
          <p className="text-center text-red-500">Blog not found.</p>
        )}
      </div>
    </main>
  );
};

export default BlogDetails;
