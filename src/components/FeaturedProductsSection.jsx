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
  const [visibleItems, setVisibleItems] = useState({});
  const timerIntervalRef = useRef(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://norivo-backend.vercel.app/products");
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const elements = document.querySelectorAll(".product-card");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [allProducts, visibleCount]);

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
        {allProducts.length === 0
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-1" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-1 mt-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          : visibleProducts.map((product) => {
              const isFlash =
                product.isOffer === true &&
                product.offerEndTime &&
                new Date(product.offerEndTime) > new Date();

              const time = timers[product._id];
              const isVisible = visibleItems[product._id];

              return (
                <div
                  key={product._id}
                  data-id={product._id}
                  onClick={() => router.push(`/product/details/${product._id}`)}
                  className={`product-card cursor-pointer relative bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4 transform transition duration-700 ease-out ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  {isFlash && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded font-semibold z-10">
                      🔥 Flash Sale
                    </div>
                  )}

                  <img
                    src={product.images[0]}
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
