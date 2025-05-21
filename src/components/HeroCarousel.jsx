"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    image:
      "https://violettefieldthreads.com/cdn/shop/products/VioletteFields4.jpg?v=1571438702&width=1080",
    title: "Welcome to Norivo Shop",
    subtitle: "Explore our beautiful handmade collections",
  },
  {
    id: 2,
    image:
      "https://violettefieldthreads.com/cdn/shop/products/VioletteFields3.jpg?v=1571438702&width=720",
    title: "New Season Arrivals",
    subtitle: "Discover the latest trends and styles",
  },
  {
    id: 3,
    image:
      "https://kicksandcrawl.com/cdn/shop/articles/Trendy_Ways_To_Dress_You_Baby_Boy_This_Summer.jpg?v=1626937654",
    title: "Summer Baby Fashion",
    subtitle: "Trendy ways to dress your baby boy this summer",
  },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideIntervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideIntervalRef.current);
  }, []);

  const handleManualSlide = (index) => {
    clearInterval(slideIntervalRef.current);
    setCurrentIndex(index);
    slideIntervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  return (
    <section
      className="relative overflow-hidden select-none"
      style={{ height: "65vh", maxHeight: "70vh", minHeight: "60vh" }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out
          ${
            index === currentIndex
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Full black overlay */}
          <div className="absolute inset-0 bg-[#0000004b] bg-opacity-70"></div>

          {/* Text on left side */}
          {index === currentIndex && (
            <div className="relative z-20 max-w-lg ml-16 mt-auto mb-auto top-1/2 transform -translate-y-1/2 text-left text-white">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                {slide.title}
              </h1>
              <p className="mt-3 text-lg md:text-xl drop-shadow-sm">
                {slide.subtitle}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Buttons at bottom right */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="bg-white bg-opacity-20 hover:bg-opacity-40 text-black rounded-full p-2 shadow-lg transition transform hover:scale-110 focus:outline-none flex items-center justify-center"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="bg-white bg-opacity-20 hover:bg-opacity-40 text-black rounded-full p-2 shadow-lg transition transform hover:scale-110 focus:outline-none flex items-center justify-center"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleManualSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none
              ${
                idx === currentIndex
                  ? "bg-[#3BB77E] scale-110 shadow-lg"
                  : "bg-white/50 hover:bg-white"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
