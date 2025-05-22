"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponTitle, setCouponTitle] = useState("");
  const [couponDescription, setCouponDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/coupons", {
        code: couponCode,
        title: couponTitle,
        description: couponDescription,
        discount: parseFloat(discountPercentage),
      });
      toast.success("Coupon added successfully!");
      setCouponCode("");
      setCouponTitle("");
      setCouponDescription("");
      setDiscountPercentage("");
    } catch (error) {
      toast.error("Failed to add coupon.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 border rounded shadow">
      {/* Toaster container to show toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-4">Add Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Coupon Code</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="Enter coupon code"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Coupon Title</label>
          <input
            type="text"
            value={couponTitle}
            onChange={(e) => setCouponTitle(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="Enter coupon title"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Coupon Description</label>
          <textarea
            value={couponDescription}
            onChange={(e) => setCouponDescription(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="Enter coupon description"
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Discount Percentage</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
            min={0}
            max={100}
            step="0.01"
            className="w-full border rounded p-2"
            placeholder="Enter discount percentage"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;
