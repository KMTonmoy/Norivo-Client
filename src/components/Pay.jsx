"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "@/Provider/AuthProvider";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51PLRDh1ER2eQQaKOIacKieEoEcmrxq1iXUsfZCu7itWd6KAMzuQyotjLWrjKag3KzgTsvZooEDBnfsfyVGMbznhJ00vAOF7I33"
);

const CheckoutForm = ({ price, cartItems, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet");
      return;
    }

    setLoading(true);

    try {
      // 1. Create payment intent on backend
      const { data } = await axios.post(
        "https://norivo-backend.vercel.app/create-payment-intent",
        {
          price,
        }
      );

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user?.email || "",
            name: user?.displayName || "",
          },
        },
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        // 3. Save payment record in DB
        await axios.post("https://norivo-backend.vercel.app/payments", {
          email: user.email,
          price,
          transactionId: paymentResult.paymentIntent.id,
          cartItems,
          date: new Date(),
        });

        toast.success("Payment successful! 🎉");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center">
          Complete Your Payment
        </h2>

        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
          className="p-3 border rounded"
        />

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
        >
          {loading ? "Processing..." : `Pay ৳${price.toFixed(2)}`}
        </button>
      </form>
    </>
  );
};

const PayPage = ({ cartItems }) => {
  const { user } = useContext(AuthContext);

  // Calculate total price (including VAT and delivery or apply your own logic)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.offerPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const vat = cartItems.reduce((sum, item) => sum + 10 * item.quantity, 0);
  const deliveryCharge = cartItems.length > 0 ? 60 : 0;
  const grandTotal = subtotal + vat + deliveryCharge;

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-700">
        Please login to proceed with payment.
      </p>
    );
  }

  if (cartItems.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-700">Your cart is empty.</p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Elements stripe={stripePromise}>
        <CheckoutForm price={grandTotal} cartItems={cartItems} user={user} />
      </Elements>
    </div>
  );
};

export default PayPage;
