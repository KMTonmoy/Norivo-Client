"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { format } from "date-fns";
import { AuthContext } from '../../../Provider/AuthProvider';
 
const MyOrders = () => {
  const { user } = useContext(AuthContext);  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://norivo-backend.vercel.app/payments");
         const filteredOrders = res.data
          .map(order => {
             const userItems = order.items.filter(item => item.userEmail === user.email);
            if (userItems.length === 0) return null; // No relevant items in this order
            return { ...order, items: userItems };
          })
          .filter(Boolean); // Remove nulls

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-500">No orders found for your account.</p>;
  }

  return (
    <div className="p-8 max-w-full mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
      <div className="space-y-8">
        {orders.map(({ _id: orderId, items, totalAmount, paymentId, orderDate }) => (
          <div
            key={orderId}
            className="bg-white rounded-xl shadow-md p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">Order ID: {orderId}</h2>
            <p className="text-gray-600">
              Payment ID: {paymentId} | Order Date: {format(new Date(orderDate), "MMM dd, yyyy")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {items.map(({ _id: itemId, product, quantity, createdAt }) => (
                <div
                  key={itemId}
                  className="flex space-x-6 items-center"
                >
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.category || "Uncategorized"}</p>
                    <p className="mt-1 text-sm text-gray-700">{product.description}</p>
                    <p className="mt-2 font-semibold">
                      Quantity: {quantity} | Price: $
                      {(product.offerPrice ?? product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 font-bold">Total Amount: ${totalAmount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
