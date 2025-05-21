"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const formEndpoint = "https://formspree.io/f/mqaqjowp";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, subject, message } = formData;
    if (!name || !subject || !message) {
      return toast.error("All fields are required.");
    }
    try {
      setLoading(true);
      await axios.post(formEndpoint, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-[#f5fdf8] py-20 px-4 sm:px-6 lg:px-8">
      <div className="  mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side Animation */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="https://aceconsult.co/wp-content/uploads/2023/11/Contact-1.gif"
            alt="Rocket Illustration"
            className="w-96 h-auto animate-bounce-slow"
          />
        </motion.div>

        {/* Right Side Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6 text-[#3bb77e]">
            <FaPaperPlane className="text-3xl" />
            <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
          </div>

          <p className="text-gray-600 mb-10 text-lg">
            We'd love to hear from you. Fill out the form and we'll get back to you shortly.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3bb77e] transition shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Your Subject"
                value={formData.subject}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3bb77e] transition shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3bb77e] transition shadow-sm resize-none"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#3bb77e] hover:bg-[#34a56d] text-white px-6 py-3 rounded-lg font-semibold shadow transition w-full sm:w-auto disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
