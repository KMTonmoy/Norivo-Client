"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "You can return any item within 30 days of purchase. Please make sure the product is unused and in original packaging.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days. Expedited options are available during checkout.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to over 100 countries. International shipping rates apply.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After your order is shipped, you'll receive a tracking number via email with a link to track it in real time.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-20 bg-white">
      <div className=" mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="https://img.freepik.com/free-vector/faqs-concept-illustration_114360-6685.jpg"
            alt="FAQ Illustration"
            className="w-full max-w-md object-contain"
          />
        </motion.div>

        {/* Right Side FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-gray-800 font-medium focus:outline-none"
                >
                  {faq.question}
                  <motion.span
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2 text-[#3bb77e]"
                  >
                    <FaChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-4 text-sm text-gray-600 overflow-hidden"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
