"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editCode, setEditCode] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDiscount, setEditDiscount] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://norivo-backend.vercel.app/coupons");
      setCoupons(res.data);
    } catch (error) {
      toast.error("Failed to fetch coupons");
      console.error(error);
    }
  };

  const startEdit = (coupon) => {
    setEditingId(coupon._id);
    setEditCode(coupon.code);
    setEditTitle(coupon.title || "");
    setEditDescription(coupon.description);
    setEditDiscount(coupon.discount);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id) => {
    if (
      !editCode.trim() ||
      !editDescription.trim() ||
      editDiscount === "" ||
      isNaN(editDiscount) ||
      editDiscount < 0 ||
      editDiscount > 100
    ) {
      toast.error("Please provide valid inputs");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`https://norivo-backend.vercel.app/coupons/${id}`, {
        code: editCode,
        title: editTitle,
        description: editDescription,
        discount: parseFloat(editDiscount),
      });
      toast.success("Coupon updated successfully");
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update coupon");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    try {
      await axios.delete(`https://norivo-backend.vercel.app/coupons/${id}`);
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Manage Coupons</h2>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold">
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                  No coupons found.
                </td>
              </tr>
            )}
            {coupons.map((coupon, idx) => {
              const isEditing = editingId === coupon._id;
              const bgColor = isEditing
                ? "bg-yellow-50 shadow-inner"
                : idx % 2 === 0
                ? "bg-white shadow-md"
                : "bg-gray-50 shadow-md";

              return (
                <tr key={coupon._id} className={`${bgColor} transition-shadow duration-300`}>
                  {isEditing ? (
                    <>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value)}
                          className="border p-2 w-full rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border p-2 w-full rounded"
                          placeholder="Optional"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editDiscount}
                          onChange={(e) => setEditDiscount(e.target.value)}
                          className="border p-2 w-full rounded"
                          min={0}
                          max={100}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="border p-2 w-full rounded resize-none"
                        />
                      </td>
                      <td className="py-3 px-4 flex space-x-2">
                        <button
                          onClick={() => handleUpdate(coupon._id)}
                          disabled={loading}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={loading}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 font-semibold text-gray-900">{coupon.code}</td>
                      <td className="py-3 px-4">{coupon.title || "-"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-1 rounded ${
                            coupon.discount <= 10
                              ? "bg-green-100 text-green-800"
                              : coupon.discount <= 20
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {coupon.discount}%
                        </span>
                        {coupon.discount === 50 && (
                          <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                            Hot
                          </span>
                        )}
                        {coupon.discount > 20 && coupon.discount !== 50 && (
                          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                            Super Offer
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{coupon.description}</td>
                      <td className="py-3 px-4 flex space-x-3">
                        <button
                          onClick={() => startEdit(coupon)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {coupons.map((coupon) => {
          const isEditing = editingId === coupon._id;

          return (
            <div
              key={coupon._id}
              className="border p-4 rounded-md shadow-md bg-gray-50"
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                    placeholder="Code"
                  />
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                    placeholder="Title (optional)"
                  />
                  <input
                    type="number"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                    placeholder="Discount"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full mb-2 border p-2 rounded resize-none"
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(coupon._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded w-full"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-lg">{coupon.code}</div>
                  <div className="text-sm text-gray-600 mb-1">{coupon.title || "-"}</div>
                  <div className="font-semibold text-indigo-600">
                    Discount: {coupon.discount}%
                    {coupon.discount === 50 && (
                      <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                        Hot
                      </span>
                    )}
                    {coupon.discount > 20 && coupon.discount !== 50 && (
                      <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                        Super Offer
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">{coupon.description}</p>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => startEdit(coupon)}
                      className="text-blue-600 text-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      disabled={loading}
                      className="text-red-600 text-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageCoupon;
