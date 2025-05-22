"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { imageUpload } from "../../../api/utils/index";
import EditBanner from "../../../components/EditBanner";

const MAX_TITLE_LENGTH = 25;
const MAX_DESCRIPTION_LENGTH = 70;

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPreview(null);
    setTitle("");
    setDescription("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        title: "No Image Selected",
        text: "Please select an image before submitting.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const imageUrl = await imageUpload(file);
      setBannerImage(imageUrl);

      const payload = {
        id: Date.now(),
        image: imageUrl,
        title: title,
        subtitle: description,
      };

      const response = await axios.post("https://norivo-backend.vercel.app/banners", payload);

      Swal.fire({
        title: "Submitted Successfully",
        text: "Your banner has been submitted.",
        icon: "success",
        confirmButtonText: "OK",
      });
      handleModalClose();
    } catch (error) {
      Swal.fire({
        title: "Upload Failed",
        text: "Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full py-5 px-10">
        <div
          className="w-full border-2 rounded-xl border-[#3bb77e] h-[500px] cursor-pointer"
          onClick={handleModalOpen}
        >
          <div className="bg-[#3bb77d52] rounded-xl h-full flex justify-center items-center text-center">
            <div>
              {preview ? (
                <img
                  src={preview}
                  alt="Banner Preview"
                  className="w-full h-[450px] object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-semibold">Add Banner</p>
                  <p className="text-6xl font-bold text-[#3bb77e] mt-3">+</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-1/3 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Upload Banner</h2>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  maxLength={MAX_TITLE_LENGTH}
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className="border rounded w-full py-2 px-3"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleModalClose}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#3bb77e] hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full rounded-2xl block px-10 py-5">
        <EditBanner />
      </div>
    </div>
  );
};

export default Page;
