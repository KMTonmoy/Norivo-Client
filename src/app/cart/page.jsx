"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Fetch cart items (mock example or replace with real API)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("/api/cart"); // Replace with real API
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  // Handle quantity change
  const handleQuantityChange = (index, newQty) => {
    setCartItems((prevItems) => {
      const updated = [...prevItems];
      const maxQty = updated[index].quantity;
      updated[index].buyQty = Math.min(Math.max(newQty, 0), maxQty);
      return updated;
    });
  };

  // Remove item
  const handleDelete = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // Coupon logic (simple mock)
  const handleApplyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.offerPrice || item.price;
      return total + price * (item.buyQty || 0);
    }, 0);

    return subtotal - discount;
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="mt-1">
                    {item.offerPrice ? (
                      <>
                        <span className="text-green-600 font-bold mr-2">
                          ৳{item.offerPrice}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          ৳{item.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-semibold">৳{item.price}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:w-1/4">
                <label className="font-medium text-sm">Qty:</label>
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={item.buyQty || 0}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value) || 0)
                  }
                  className="w-16 border rounded-md p-1 text-center"
                />
                <p className="text-xs text-gray-500">(Max: {item.quantity})</p>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}

          {/* Coupon Section */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2">Have a Coupon?</h3>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="border px-3 py-2 rounded-md w-full max-w-xs"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 mt-2 font-semibold">
                Coupon applied! ৳{discount} off
              </p>
            )}
          </div>

          {/* Total */}
          <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-2xl font-extrabold text-green-600">৳{calculateTotal()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
