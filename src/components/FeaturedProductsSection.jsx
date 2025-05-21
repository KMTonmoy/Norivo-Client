"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function shuffleArray(array) {
  // Fisher-Yates shuffle
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchProducts = () => {
    axios
      .get("/products.json")
      .then((res) => {
        const featured = res.data.filter((item) => item.isFeatured === true);
        const shuffled = shuffleArray(featured);
        setAllProducts(shuffled);
        setVisibleCount(8); 
        setError(null);
      })
      .catch(() => {
        setError("Failed to load products");
      });
  };

  useEffect(() => {
    fetchProducts();

    intervalRef.current = setInterval(() => {
      fetchProducts();
    }, 5 * 60 * 1000);  
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

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

      {error && (
        <p className="text-center text-red-500 mb-6">{error}</p>
      )}

<div className="flex justify-center mx-auto items-center">
  <div className="inline-grid grid-cols-4 gap-x-6 gap-y-10 w-auto">
    {visibleProducts.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-lg shadow-md p-4 w-full"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded"
        />
        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-gray-800 mt-1 text-sm line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2">
          {product.offerPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">
                ৳{product.offerPrice}
              </span>
              <span className="line-through text-gray-400 text-sm">
                ৳{product.price}
              </span>
            </div>
          ) : (
            <span className="text-gray-800 font-bold">৳{product.price}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Quantity: {product.quantity}
        </p>
      </div>
    ))}
  </div>
</div>


      {/* Show More / Show Less button */}
      {allProducts.length > 8 && (
        <div className="flex justify-center mt-8">
          {visibleCount < allProducts.length ? (
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
