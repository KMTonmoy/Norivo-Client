"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
 
 
const Countdown = ({ endTime }) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = dayjs();
      const end = dayjs(endTime);
      const diff = end.diff(now);

      if (diff <= 0) {
        setRemaining("Deal Ended");
        return;
      }

      const time = dayjs.duration(diff);
      setRemaining(
        `${String(time.hours()).padStart(2, "0")}:${String(
          time.minutes()
        ).padStart(2, "0")}:${String(time.seconds()).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span className="text-sm text-red-600 font-medium">{remaining}</span>;
};

const OffersSection = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios.get("/products.json").then((res) => {
      const filtered = res.data.filter((item) => item.isOffer === true);
      setOffers(filtered);
    });
  }, []);

  return (
    <section className="py-16  ">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-10">
        Flash Deals 🔥
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {offers.map((product) => {
          const discountPercent = Math.round(
            ((product.price - product.offerPrice) / product.price) * 100
          );

          return (
            <div
              key={product._id}
              className="relative bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4"
            >
              {/* Discount Tag */}
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercent}% OFF
              </div>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              {/* Product Info */}
              <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                {product.description}
              </p>

              {/* Pricing */}
              <div className="mt-2">
                <span className="text-red-600 font-bold text-lg">
                  ৳{product.offerPrice}
                </span>
                <span className="text-gray-400 line-through text-sm ml-2">
                  ৳{product.price}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Quantity: {product.quantity}
              </p>

              
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OffersSection;
