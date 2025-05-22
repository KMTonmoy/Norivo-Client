"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", subject: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://formspree.io/f/xzzrqvvz", form, {
        headers: { Accept: "application/json" },
      });
      toast.success("Message sent!");
      setForm({ name: "", subject: "", description: "" });
    } catch {
      toast.error("Failed to send message.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg max-w-5xl w-full overflow-hidden">
        {/* Image side */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')" }}
          aria-label="Contact Us Image"
        ></div>

        {/* Form side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
            />
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={5}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#3BB77E" }}
              className="w-full text-white font-semibold py-3 rounded-md hover:brightness-110 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
