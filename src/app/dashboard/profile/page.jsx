'use client';
import { useContext } from "react";
 import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { AuthContext } from '@/Provider/AuthProvider';

const Page = () => {
  const { user } = useContext(AuthContext);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text || "");
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Banner */}
        <div className="relative">
          <motion.img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
            alt="Banner"
            className="w-full h-48 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />

          {/* Avatar */}
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <img
              src={user?.photoURL}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </motion.div>
        </div>

        {/* User Info */}
        <div className="mt-16 text-center px-4 pb-6 space-y-4">
          <motion.h2
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {user?.displayName}
          </motion.h2>

          {/* Email */}
          <motion.div
            className="flex justify-center items-center gap-2 bg-gray-100 px-4 py-2 rounded-md w-fit mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-sm text-gray-700 truncate max-w-[180px]">
              {user?.email}
            </span>
            <button
              onClick={() => handleCopy(user?.email, "Email")}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Copy Email"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </motion.div>

          {/* UID */}
          <motion.div
            className="flex justify-center items-center gap-2 bg-gray-100 px-4 py-2 rounded-md w-fit mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="font-medium text-gray-700">UID:</span>
            <span className="text-sm text-gray-700 truncate max-w-[180px]">
              {user?.uid}
            </span>
            <button
              onClick={() => handleCopy(user?.uid, "UID")}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Copy UID"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Join Date */}
          <motion.div
            className="flex justify-center items-center gap-2 bg-gray-100 px-4 py-2 rounded-md w-fit mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <span className="font-medium text-gray-700">Join Date:</span>
            <span className="text-sm text-gray-700">
              {new Date(user?.metadata?.creationTime).toLocaleDateString()}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
