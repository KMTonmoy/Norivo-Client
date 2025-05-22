"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PRODUCTS_PER_PAGE = 8;

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md animate-pulse flex flex-col w-[260px] mx-auto" style={{ minWidth: "260px" }}>
    <div className="bg-gray-300 h-40 rounded-t-lg"></div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-12 bg-gray-300 rounded mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    selectedCategories: new Set(),
    minPrice: 0,
    maxPrice: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("https://norivo-backend.vercel.app/products"),
          axios.get("https://norivo-backend.vercel.app/categories"),
        ]);
        setAllProducts(productsRes.data);
        setCategories(categoriesRes.data.map((c) => c.name).sort());
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchLower));
    }

    if (filters.selectedCategories.size > 0) {
      filtered = filtered.filter((p) => filters.selectedCategories.has(p.category));
    }

    filtered = filtered.filter((p) => {
      const price = p.offerPrice || p.price;
      return (
        (filters.minPrice === 0 || price >= filters.minPrice) &&
        (filters.maxPrice === 0 || price <= filters.maxPrice)
      );
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
      newSet.has(cat) ? newSet.delete(cat) : newSet.add(cat);
      return { ...prev, selectedCategories: newSet };
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="w-full md:w-72 bg-white p-6 shadow-lg rounded-lg md:sticky md:top-6 md:h-[calc(100vh-3rem)] overflow-y-auto mb-6 md:mb-0">
        <h2 className="text-3xl font-extrabold mb-8 border-b border-green-500 pb-3 text-green-700">Filters</h2>
        <div className="mb-8">
          <label className="block font-semibold mb-2 text-gray-800">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search products..."
            className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-3 text-gray-800">Category</label>
          <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-md p-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center space-x-3 mb-2 cursor-pointer text-gray-700 hover:text-green-600 select-none">
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="accent-green-500 w-5 h-5"
                />
                <span className="text-sm font-medium">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-2 text-gray-800">Price Range (৳)</label>
          <div className="flex space-x-4">
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })}
              placeholder="Min"
              className="w-1/2 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || 0 })}
              placeholder="Max"
              className="w-1/2 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Leave empty or 0 to disable price filtering.</p>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Products</h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-40 text-lg font-medium">No products found.</p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {currentProducts.map((product) => (
                <motion.div
                  key={product._id}
                  onClick={() => router.push(`/product/details/${product._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-300 flex flex-col w-full md:w-[260px] mx-auto"
                  style={{ minWidth: "260px" }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-green-600 font-medium mt-1 truncate">{product.category}</p>
                    <p className="text-gray-700 mt-2 line-clamp-3 flex-grow text-sm">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-red-600">
                          ৳{product.offerPrice || product.price}
                        </span>
                        {product.offerPrice && (
                          <span className="line-through text-gray-400 ml-2 text-base">
                            ৳{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-3 flex-wrap gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
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
                    className={`px-4 py-2 rounded-md font-semibold transition ${
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
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed text-gray-700"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
