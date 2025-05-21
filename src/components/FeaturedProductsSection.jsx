"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Countdown utility
const calculateTimeLeft = (endTime) => {
  const difference = new Date(endTime) - new Date();
  if (difference <= 0) return null;

  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor((difference / 1000 / 60 / 60) % 24);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    hours,
    minutes,
    seconds,
  };
};

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [error, setError] = useState(null);
  const [timers, setTimers] = useState({});
  const timerIntervalRef = useRef(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products.json");
      const featured = res.data.filter((item) => item.isFeatured === true);
      const shuffled = shuffleArray(featured);
      setAllProducts(shuffled);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Start countdown after products are loaded (only once)
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      const updatedTimers = {};

      allProducts.forEach((product) => {
        if (product.isOffer && product.offerEndTime) {
          const timeLeft = calculateTimeLeft(product.offerEndTime);
          if (timeLeft) {
            updatedTimers[product._id] = timeLeft;
          }
        }
      });

      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [allProducts]);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, allProducts.length));
  };

  const handleShowLess = () => {
    setVisibleCount(8);
  };

  const visibleProducts = allProducts.slice(0, visibleCount);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Featured Products
      </h2>

      {error && <p className="text-center text-red-500 mb-6">{error}</p>}

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {visibleProducts.map((product) => {
            const isFlash =
              product.isOffer === true &&
              product.offerEndTime &&
              new Date(product.offerEndTime) > new Date();

            const time = timers[product._id];

            return (
              <div
                key={product._id}
                className="relative bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4"
              >
                {isFlash && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded font-semibold z-10">
                    🔥 Flash Sale
                  </div>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />

                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-gray-800 text-sm line-clamp-2 mt-1">
                  {product.description}
                </p>

                <div className="mt-2">
                  <span className="text-red-500 font-bold text-lg">
                    ৳{product.offerPrice ?? product.price}
                  </span>
                  {product.offerPrice && (
                    <span className="line-through text-gray-400 ml-2">
                      ৳{product.price}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Quantity: {product.quantity}
                </p>
 
              </div>
            );
          })}
        </div>
 
      {/* Show More / Show Less buttons */}
      {allProducts.length > 8 && (
        <div className="flex justify-center mt-8">
          {visibleCount < allProducts.length ? (
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-[#3bb77e] text-white rounded hover:bg-[#24553e] transition"
            >
              Show More
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
