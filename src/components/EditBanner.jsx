'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

// Image upload function
const imageUpload = async (image) => {
  const formData = new FormData();
  formData.append('image', image);
  const { data } = await axios.post(
    'https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d',
    formData
  );
  return data.data.display_url;
};

const EditBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    title: '',
    subtitle: '',
    image: '',
    newImageFile: null,
  });

  const fetchBannerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://norivo-backend.vercel.app/banners');
      if (!response.ok) throw new Error('Failed to fetch banner data');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://norivo-backend.vercel.app/banners/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete the banner');
        await fetchBannerData();
        Swal.fire('Deleted!', 'Your banner has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    }
  };

  const handleEdit = () => {
    const currentImage = images[currentImageIndex];
    if (currentImage) {
      setEditedData({
        title: currentImage.title,
        subtitle: currentImage.subtitle,
        image: currentImage.image,
        newImageFile: null,
      });
      setIsModalOpen(true);
    }
  };

  const handleSave = async () => {
    const currentImage = images[currentImageIndex];
    if (!currentImage) return;
    const { _id } = currentImage;

    let updatedImageUrl = editedData.image;

    if (editedData.newImageFile) {
      try {
        updatedImageUrl = await imageUpload(editedData.newImageFile);
      } catch {
        Swal.fire('Error!', 'Image upload failed', 'error');
        return;
      }
    }

    const updatePayload = {
      title: editedData.title,
      subtitle: editedData.subtitle,
      image: updatedImageUrl,
    };

    try {
      const response = await fetch(`https://norivo-backend.vercel.app/banners/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (!response.ok) throw new Error('Failed to update the banner');
      await fetchBannerData();
      setIsModalOpen(false);
      Swal.fire('Updated!', 'Your banner has been updated.', 'success');
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="relative z-0">
      {images.length === 0 ? (
        <div className="text-center">No banners available. Please add a banner.</div>
      ) : (
        images[currentImageIndex] && (
          <div className="relative h-[800px] lg:h-[800px] transition-all duration-700 ease-in-out">
            <img
              src={images[currentImageIndex].image}
              alt={images[currentImageIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[#00000044] bg-opacity-40">
              <div className="container mx-auto grid lg:grid-cols-2 gap-5 items-center px-5 lg:px-10">
                <div className="text-white text-center lg:text-left">
                  <h1 className="text-3xl lg:text-5xl font-bold mb-4">{images[currentImageIndex].title}</h1>
                  <p className="mb-6 text-sm lg:text-base">{images[currentImageIndex].subtitle}</p>
                  <div className="flex space-x-2 justify-center lg:justify-start">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Edit</button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(images[currentImageIndex]._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
        >
          Previous
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
        >
          Next
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Banner</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editedData.title}
                  onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Subtitle</label>
                <textarea
                  value={editedData.subtitle}
                  onChange={(e) => setEditedData({ ...editedData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={editedData.image}
                  readOnly
                  className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Upload New Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditedData({ ...editedData, newImageFile: e.target.files[0] || null })
                  }
                  className="w-full"
                />
              </div>
            </form>
            <div className="flex justify-between mt-4">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBanner;
