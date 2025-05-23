"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState(["", "", "", ""]);
  const [imagePreviews, setImagePreviews] = useState(["", "", "", ""]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://norivo-backend.vercel.app/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://norivo-backend.vercel.app/products/${id}`);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        fetchProducts();
      } catch (error) {
        Swal.fire("Error", "Failed to delete product.", "error");
      }
    }
  };

  const handleImageChange = (index, file) => {
    const updatedFiles = [...imageFiles];
    updatedFiles[index] = file;
    setImageFiles(updatedFiles);

    const previews = [...imagePreviews];
    previews[index] = file ? URL.createObjectURL(file) : "";
    setImagePreviews(previews);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(
      "https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d",
      formData
    );
    return res.data.data.display_url;
  };

  const handleUpdate = async () => {
    const updatedImages = await Promise.all(
      imageFiles.map(async (file, i) => {
        if (file && file.name) {
          return await uploadImage(file);
        } else {
          return editingProduct.images[i] || "";
        }
      })
    );

    try {
      await axios.patch(
        `https://norivo-backend.vercel.app/products/${editingProduct._id}`,
        {
          ...editingProduct,
          images: updatedImages,
        }
      );
      Swal.fire("Updated!", "Product updated successfully.", "success");
      setEditingProduct(null);
      setImageFiles(["", "", "", ""]);
      setImagePreviews(["", "", "", ""]);
      fetchProducts();
    } catch (error) {
      Swal.fire("Error", "Failed to update product.", "error");
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-xl shadow-xl bg-white"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setImageFiles(["", "", "", ""]);
                  setImagePreviews(["", "", "", ""]);
                }}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Update Product</h3>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              className="w-full border mb-3 p-2 rounded"
              placeholder="Product Name"
            />
            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
              className="w-full border mb-3 p-2 rounded"
              placeholder="Category"
            />
            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
              className="w-full border mb-3 p-2 rounded"
              placeholder="Description"
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full border mb-3 p-2 rounded"
              placeholder="Price"
            />
            <input
              type="number"
              value={editingProduct.offerPrice}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  offerPrice: parseFloat(e.target.value),
                })
              }
              className="w-full border mb-3 p-2 rounded"
              placeholder="Offer Price"
            />
            <input
              type="number"
              value={editingProduct.quantity}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  quantity: parseInt(e.target.value),
                })
              }
              className="w-full border mb-3 p-2 rounded"
              placeholder="Quantity"
            />

            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingProduct.isFeatured}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingProduct.isOffer}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isOffer: e.target.checked,
                    })
                  }
                />
                Offer
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(i, e.target.files[0])}
                    className="w-full border p-2 rounded"
                  />
                  {(imagePreviews[i] || editingProduct.images[i]) && (
                    <img
                      src={imagePreviews[i] || editingProduct.images[i]}
                      alt={`Preview ${i}`}
                      className="w-full h-24 object-cover mt-1 rounded"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setImagePreviews(["", "", "", ""]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
