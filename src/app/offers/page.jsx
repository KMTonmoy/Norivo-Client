"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

// Skeleton Card Component
const CouponSkeleton = () => (
  <div className="bg-white shadow-md rounded-lg p-6 animate-pulse border-l-8 border-gray-200">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
    <div className="h-6 bg-gray-200 rounded w-1/4" />
  </div>
);

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("https://norivo-backend.vercel.app/coupons");
        setCoupons(res.data);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const getColorAndTag = (discount) => {
    if (discount <= 25) return { color: "green", tag: "Low Deal" };
    if (discount <= 79) return { color: "yellow", tag: "Super Deal" };
    return { color: "red", tag: "Hot Deal" };
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Available Coupons</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CouponSkeleton key={i} />)
          : [...coupons].reverse().map((coupon, index) => {
              const { color, tag } = getColorAndTag(coupon.discount);
              return (
                <motion.div
                  key={coupon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white shadow-md rounded-lg p-6 border-l-8"
                  style={{ borderColor: color }}
                >
                  <div className="flex items-center mb-4 gap-2">
                    <BadgePercent className="text-green-600" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Code: {coupon.code}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-700 font-semibold">{coupon.title}</p>
                  <p className="text-sm text-gray-600 mt-1 mb-4">{coupon.description}</p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xl font-bold ${
                        color === "green"
                          ? "text-green-600"
                          : color === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {coupon.discount}% OFF
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        tag === "Low Deal"
                          ? "bg-green-100 text-green-700"
                          : tag === "Super Deal"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tag}
                    </span>
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
};

export default Coupons;
