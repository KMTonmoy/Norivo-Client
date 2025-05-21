"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const formEndpoint = "https://formspree.io/f/mqaqjowp"; 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      setLoading(true);
      await axios.post(formEndpoint, { email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f9f9f9] py-16 px-4 sm:px-6 lg:px-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="flex justify-center mb-4 text-[#3bb77e]">
          <FaEnvelope className="text-3xl" />
        </div>

        <h2 className="text-3xl font-bold mb-3 text-gray-800">
          Subscribe to our Newsletter
        </h2>
        <p className="text-gray-600 mb-8">
          Get the latest updates, offers, and baby tips straight to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3bb77e] transition"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-[#3bb77e] hover:bg-[#34a56d] text-white px-6 py-3 rounded-full transition font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Subscribe"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
