"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const PRODUCTS_PER_PAGE = 8;

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    selectedCategories: new Set(),
    minPrice: 0,
    maxPrice: 0,
    minRating: 0, // 0 means no filter
  });

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products.json");
        setAllProducts(res.data);

        const cats = Array.from(new Set(res.data.map((p) => p.category))).sort();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.selectedCategories.size > 0) {
      filtered = filtered.filter((p) => filters.selectedCategories.has(p.category));
    }

    filtered = filtered.filter((p) => {
      const priceCheck =
        (filters.minPrice === 0 || p.price >= filters.minPrice) &&
        (filters.maxPrice === 0 || p.price <= filters.maxPrice);

      const rating = p.ratings?.average ?? 0;

      let ratingCheck = false;
      switch (filters.minRating) {
        case 0:
          ratingCheck = true;
          break;
        case 1:
          ratingCheck = rating >= 1 && rating < 2;
          break;
        case 2:
          ratingCheck = rating >= 2 && rating < 3;
          break;
        case 3:
          ratingCheck = rating >= 3 && rating < 4;
          break;
        case 4:
          ratingCheck = rating >= 4 && rating < 5;
          break;
        case 5:
          ratingCheck = rating === 5;
          break;
        default:
          ratingCheck = true;
      }

      return priceCheck && ratingCheck;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const toggleCategory = (cat) => {
    setFilters((prev) => {
      const newSet = new Set(prev.selectedCategories);
      if (newSet.has(cat)) newSet.delete(cat);
      else newSet.add(cat);
      return { ...prev, selectedCategories: newSet };
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside className="w-full md:w-72 bg-white p-6 shadow-lg md:sticky md:top-0 md:h-screen overflow-y-auto mb-6 md:mb-0">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Filters</h2>

        <div className="mb-6">
          <label className="block font-semibold mb-1 text-gray-700">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search products..."
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Category</label>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center space-x-2 mb-1 cursor-pointer text-gray-700 hover:text-green-600"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="accent-green-500"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Price Range (৳)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })
              }
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Min"
            />
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) || 0 })
              }
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Max"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Leave empty or 0 to disable price filtering.
          </p>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">Rating Range</label>
          <select
            value={filters.minRating}
            onChange={(e) =>
              setFilters({ ...filters, minRating: Number(e.target.value) })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value={0}>All Ratings</option>
            <option value={1}>1.0 to &lt; 2.0</option>
            <option value={2}>2.0 to &lt; 3.0</option>
            <option value={3}>3.0 to &lt; 4.0</option>
            <option value={4}>4.0 to &lt; 5.0</option>
            <option value={5}>5 only</option>
          </select>
        </div>
      </aside>

      <main className="flex-grow p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Products</h1>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-40 text-lg font-medium">No products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => router.push(`/product/details/${product._id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300 flex flex-col"
            >
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-green-600 font-medium mt-1">{product.category}</p>
                <p className="text-gray-700 mt-2 line-clamp-3 flex-grow">{product.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-red-600">
                      ৳{product.offerPrice || product.price}
                    </span>
                    {product.offerPrice && (
                      <span className="line-through text-gray-400 ml-2 text-lg">
                        ৳{product.price}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 font-semibold flex items-center space-x-1">
                    <span>⭐</span>
                    <span>{product.ratings?.average ?? "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed text-gray-700"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  currentPage === i + 1
                    ? "bg-green-700 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed text-gray-700"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
