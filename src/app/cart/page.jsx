"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/Provider/AuthProvider";
import { FiTrash2 } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51PLRDh1ER2eQQaKOIacKieEoEcmrxq1iXUsfZCu7itWd6KAMzuQyotjLWrjKag3KzgTsvZooEDBnfsfyVGMbznhJ00vAOF7I33"
);

const CheckoutForm = ({
  cartItems,
  grandTotal,
  onPaymentSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        "https://norivo-backend.vercel.app/create-payment-intent",
        {
          price: grandTotal,
        }
      );

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        const orderData = {
          items: cartItems,
          totalAmount: grandTotal,
          paymentId: paymentResult.paymentIntent.id,
          userEmail: cartItems[0]?.userEmail || "",
          orderDate: new Date(),
        };
        await axios.post("https://norivo-backend.vercel.app/payments", orderData);
        onPaymentSuccess();
      }
    } catch {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : `Pay ৳${grandTotal.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const deleteUserCartItems = async () => {
    try {
      if (!user?.email) return;
      await axios.delete(`https://norivo-backend.vercel.app/cart/delete/${user.email}`);
    } catch (error) {
      console.error("Failed to delete user cart items:", error);
    }
  };

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`https://norivo-backend.vercel.app/cart/${user.email}`)
        .then((res) => {
          setCartItems(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user?.email]);

  useEffect(() => {
    axios.get("https://norivo-backend.vercel.app/coupons").then((res) => {
      setCoupons(res.data);
    });
  }, []);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 0 || quantity > 10) return;
    if (quantity === 0) {
      handleDelete(id);
      return;
    }
    axios.patch(`https://norivo-backend.vercel.app/cart/${id}`, { quantity }).then(() => {
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    });
  };

  const handleDelete = (id) => {
    axios.delete(`https://norivo-backend.vercel.app/cart/${id}`).then(() => {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    });
  };

  const handleApplyCoupon = () => {
    const matched = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (matched) {
      setDiscountPercent(matched.discount);
      toast(`✅ Coupon applied: ${matched.title}`);
    } else {
      setDiscountPercent(0);
      toast("❌ Invalid coupon code");
    }
  };

  const getItemTotal = (item) => {
    const price = item.product.offerPrice || item.product.price;
    return price * item.quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const vat = cartItems.reduce((sum, item) => sum + 10 * item.quantity, 0);
  const deliveryCharge = cartItems.length > 0 ? 60 : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal + vat + deliveryCharge - discountAmount;

  if (loading)
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  if (paymentSuccess)
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh] bg-green-50 text-green-700 px-4">
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-24 h-24 mb-6"
        />
        <motion.h2
          className="text-4xl font-bold mb-3"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Payment Successful!
        </motion.h2>
        <motion.p
          className="text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Thank you for your purchase 🎉
        </motion.p>
        <motion.a
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Go Back Home
        </motion.a>
      </div>
    );

  return (
    <div className="w-full min-h-[100vh] p-6 max-w-[1400px] mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">My Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-xl p-6"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-xl">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-500">{item.product.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span className="font-medium text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="text-green-600 font-bold text-2xl">
                    ৳{getItemTotal(item)}
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-1/4">
            <div className="bg-white shadow-xl rounded-xl p-6 mb-6 sticky top-20">
              <h3 className="text-xl font-semibold mb-3">Have a Coupon?</h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Enter coupon code"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Apply
                </button>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Payment Summary
              </h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>VAT (৳10 per product):</span>
                <span>৳{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Charge:</span>
                <span>৳{deliveryCharge.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between mb-2 text-green-600 font-medium">
                  <span>Coupon Discount ({discountPercent}%):</span>
                  <span>-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Grand Total:</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>
              <button
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
                onClick={() => setShowCheckout(true)}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-[#0000002f] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Enter Payment Details
            </h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                cartItems={cartItems}
                grandTotal={grandTotal}
                onPaymentSuccess={async () => {
                  setShowCheckout(false);
                  setPaymentSuccess(true);
                  setCartItems([]);
                  await deleteUserCartItems();
                }}
                onCancel={() => setShowCheckout(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
