"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/Provider/AuthProvider";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { _id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [loadingCart, setLoadingCart] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (_id) {
      axios
        .get(`https://norivo-backend.vercel.app/products/${_id}`)
        .then((res) => {
          setProduct(res.data);
          setMainImage(res.data.images?.[0]);
          fetchRelated(res.data.category, res.data._id);
        })
        .catch((err) => console.error(err));
    }
  }, [_id]);

  const fetchRelated = async (category, currentId) => {
    try {
      const { data } = await axios.get(
        "https://norivo-backend.vercel.app/products"
      );
      const filtered = data
        .filter((item) => item.category === category && item._id !== currentId)
        .slice(0, 8);
      setRelated(filtered);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "decrease" && prev > 1) return prev - 1;
      if (type === "increase" && product && prev < product.quantity) return prev + 1;
      return prev;
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user?.email) {
      toast("Please log in to add items to your cart.");
      return;
    }

    setLoadingCart(true);

    const payload = {
      userEmail: user.email,
      product,
      quantity,
    };

    try {
      const response = await axios.post("https://norivo-backend.vercel.app/cart", payload);

      if (response.status === 200 || response.status === 201) {
        toast("Product added to cart successfully!");
      } else {
        toast("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast("An error occurred while adding product to cart.");
    } finally {
      setLoadingCart(false);
    }
  };

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <img
            src={mainImage}
            alt="Main Product"
            className="w-full h-96 object-cover rounded-xl"
          />
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`h-20 w-20 object-cover rounded-lg cursor-pointer border ${
                  img === mainImage ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>

          <div className="text-lg space-y-2">
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              <span className="line-through text-gray-500">
                ${product.price.toLocaleString()}
              </span>{" "}
              <span className="text-green-600 font-semibold">
                ${product.offerPrice.toLocaleString()}
              </span>
            </p>
            <p>
              <strong>Quantity Available:</strong> {product.quantity}
            </p>
            <p>
              <strong>Ratings:</strong> ⭐ {product.ratings?.average ?? 0} (
              {product.ratings?.count ?? 0} reviews)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleQuantityChange("decrease")}
              className="px-3 py-1 bg-gray-300 rounded text-xl"
            >
              -
            </button>
            <span className="text-xl font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increase")}
              className="px-3 py-1 bg-gray-300 rounded text-xl"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={loadingCart}
            className={`mt-4 px-6 py-2 rounded text-white ${
              loadingCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loadingCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Relevant Products - Your Matches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item._id}
                onClick={() => router.push(`/product/details/${item._id}`)}
                className="cursor-pointer bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-green-600 font-bold">
                  ${item.offerPrice.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
