"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://norivo-backend.vercel.app/categories")
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch categories");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Baby Dress Categories
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 px-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 p-3 rounded shadow-md"
            >
              <div className="w-full h-24 bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div>
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Baby Dress Categories
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 px-4">
          {categories.map((category) => (
          <a href={`/products?category=${category.name}`}>
              <div
              key={category.id}
              className="text-center shadow-md rounded-md p-3 bg-white transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-24 object-cover rounded mb-2"
              />
              <h3 className="text-sm font-medium text-gray-700">
                {category.name}
              </h3>
            </div>
          </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
