"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useRouter } from "next/navigation";

dayjs.extend(duration);

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
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [visibleItems, setVisibleItems] = useState({});
  const SHOW_LIMIT = 8;
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/products.json")
      .then((res) => {
        const filtered = res.data.filter((item) => item.isOffer === true);
        setOffers(filtered);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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

    const elements = document.querySelectorAll(".offer-card");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [offers, showAll]);

  const displayedOffers = showAll ? offers : offers.slice(0, SHOW_LIMIT);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-10">
        Flash Deals 🔥
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {loading
          ? Array.from({ length: SHOW_LIMIT }).map((_, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow p-4 animate-pulse"
              >
                <div className="absolute top-2 left-2 bg-gray-300 rounded w-16 h-5" />
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4" />
                <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-300 rounded mb-1 w-1/2" />
                <div className="h-4 bg-gray-300 rounded mb-3 w-full" />
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-300 rounded w-1/3" />
              </div>
            ))
          : displayedOffers.map((product) => {
              const discountPercent = Math.round(
                ((product.price - product.offerPrice) / product.price) * 100
              );
              const isVisible = visibleItems[product._id];

              return (
                <div
                  key={product._id}
                  data-id={product._id}
                  onClick={() => router.push(`/product/details/${product._id}`)}
                  className={`offer-card cursor-pointer relative bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4 transform transition duration-700 ease-out ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discountPercent}% OFF
                  </div>

                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                    {product.description}
                  </p>

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

                  {product.offerEndTime && (
                    <Countdown endTime={product.offerEndTime} />
                  )}
                </div>
              );
            })}
      </div>

      {offers.length > SHOW_LIMIT && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#3bb77e] hover:bg-[#34a46b] text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default OffersSection;
