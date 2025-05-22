'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: "", excerpt: "", image: "" });
  const [imageFile, setImageFile] = useState(null);

  const fetchBlogs = async () => {
    const { data } = await axios.get("https://norivo-backend.vercel.app/blogs");
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const imageUpload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    const { data } = await axios.post(
      "https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d",
      formData
    );
    return data.data.display_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;
    if (imageFile) {
      imageUrl = await imageUpload(imageFile);
    }
    if (editId) {
      await axios.patch(`https://norivo-backend.vercel.app/blogs/${editId}`, {
        ...formData,
        image: imageUrl,
      });
      toast.success("Blog updated successfully");
    } else {
      await axios.post("https://norivo-backend.vercel.app/blogs", {
        ...formData,
        image: imageUrl,
        date: new Date().toISOString().split("T")[0],
      });
      toast.success("Blog added successfully");
    }
    setModalOpen(false);
    setFormData({ title: "", excerpt: "", image: "" });
    setEditId(null);
    setImageFile(null);
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await axios.delete(`https://norivo-backend.vercel.app/blogs/${id}`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    }
  };

  const openEditModal = (blog) => {
    setFormData({ title: blog.title, excerpt: blog.excerpt, image: blog.image });
    setEditId(blog._id);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blogs</h2>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ title: "", excerpt: "", image: "" });
            setImageFile(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Add Blog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="shadow-lg p-4 rounded-xl bg-white flex flex-col gap-2"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-40 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold text-center">{blog.title}</h3>
            <p className="text-sm text-gray-600 text-center">{blog.excerpt}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(blog)}
                className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold mb-4 text-center">
                {editId ? "Edit Blog" : "Add Blog"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  {editId ? "Update Blog" : "Add Blog"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBlogs;
