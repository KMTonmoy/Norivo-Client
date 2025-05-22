"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const imageUpload = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await axios.post(
    "https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d",
    formData
  );

  return data.data.display_url;
};

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(["", "", "", ""]);
  const [previewUrls, setPreviewUrls] = useState(["", "", "", ""]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://norivo-backend.vercel.app/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (index, file) => {
    const newPreviews = [...previewUrls];
    newPreviews[index] = URL.createObjectURL(file);

    const newImages = [...images];
    newImages[index] = file;

    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async () => {
    try {
      const uploadedImageUrls = await Promise.all(
        images.filter((img) => img).map((img) => imageUpload(img))
      );

      const productData = {
        name,
        category,
        images: uploadedImageUrls,
        description,
        price: parseFloat(price),
        offerPrice: parseFloat(offerPrice),
        quantity: parseInt(quantity),
        isFeatured,
        isOffer,
        ratings: {
          average: 5,
          count: 0,
        },
        questions: [],
        suggestedProductIds: [],
      };

      await axios.post("https://norivo-backend.vercel.app/products", productData);
      Swal.fire("Success", "Product added successfully!", "success");

      setName("");
      setCategory("");
      setSelectedCategory(null);
      setImages(["", "", "", ""]);
      setPreviewUrls(["", "", "", ""]);
      setDescription("");
      setPrice("");
      setOfferPrice("");
      setQuantity("");
      setIsFeatured(false);
      setIsOffer(false);
    } catch (error) {
      Swal.fire("Error", "Failed to add product.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <div>
            <label className="font-medium mb-1 block">Select Category</label>
            <select
              onChange={(e) => {
                const selected = categories.find(
                  (cat) => cat._id === e.target.value
                );
                setSelectedCategory(selected);
                setCategory(selected?.name || "");
              }}
              value={selectedCategory?._id || ""}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <div className="mt-3 flex items-center gap-4 bg-gray-50 p-2 rounded shadow">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-14 h-14 object-cover rounded border"
                />
                <div>
                  <h4 className="font-semibold text-sm">
                    {selectedCategory.name}
                  </h4>
                  <p className="text-xs text-gray-500">Selected Category</p>
                </div>
              </div>
            )}
          </div>
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(index, e.target.files[0])}
              className="w-full border px-4 py-2 rounded"
            />
          ))}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            rows="4"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOffer}
                onChange={(e) => setIsOffer(e.target.checked)}
              />
              Offer
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#3bb77e] text-white py-2 px-6 rounded hover:bg-[#2da164]"
          >
            Submit Product
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 rounded-lg p-5 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          <div className="border rounded-lg overflow-hidden mb-4">
            {previewUrls[0] ? (
              <img
                src={previewUrls[0]}
                alt="cover"
                className="w-full h-60 object-cover"
              />
            ) : (
              <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                Cover Photo
              </div>
            )}
          </div>
          <div className="flex gap-2 mb-4">
            {previewUrls.slice(1).map((url, i) =>
              url ? (
                <img
                  key={i}
                  src={url}
                  alt={`preview-${i}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ) : (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500"
                >
                  Image {i + 2}
                </div>
              )
            )}
          </div>
          <h4 className="text-xl font-bold">{name || "Product Name"}</h4>
          <p className="text-gray-500">{category || "Category"}</p>
          <p className="text-sm my-2">
            {description || "Description here..."}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-green-600 font-bold">
              ${offerPrice || 0}
            </span>
            <span className="line-through text-gray-500">${price || 0}</span>
          </div>
          <p className="text-sm mt-2">Quantity: {quantity || 0}</p>
          <div className="flex gap-2 mt-2">
            {isFeatured && (
              <span className="bg-yellow-300 px-2 py-1 rounded text-xs">
                Featured
              </span>
            )}
            {isOffer && (
              <span className="bg-red-300 px-2 py-1 rounded text-xs">
                Offer
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProductPage;
