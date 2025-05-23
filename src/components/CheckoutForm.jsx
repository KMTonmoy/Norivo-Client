// components/CheckoutForm.jsx
'use client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckoutForm = ({ price, cartItems, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create PaymentIntent on backend
      const res = await axios.post('https://norivo-backend.vercel.app/create-payment-intent', {
        price,
      });

      const clientSecret = res.data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user?.email,
            name: user?.displayName,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        // 3. Store payment info in DB
        await axios.post('https://norivo-backend.vercel.app/payments', {
          email: user.email,
          price,
          transactionId: result.paymentIntent.id,
          cartItems,
          date: new Date(),
        });

        toast.success('🎉 Payment successful!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;
