"use client";

import { useEffect, useState } from "react";

export default function ProductDetailsButton({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = () => {
    console.log("Product added to cart:", product);
    closeModal();
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        View Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-opacity-60">
          <div className="relative bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-2xl w-[90%] max-w-md transition-all">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-black text-2xl font-bold"
            >
              ×
            </button>

            <div className="flex justify-center mb-4">
              <img
                src={product.image1}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">{product.name}</h2>
            <p className="text-lg text-white text-center mb-2">PKR {product.price}</p>
            <p className="text-white text-sm mb-6 text-center">{product.description}</p>

            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
