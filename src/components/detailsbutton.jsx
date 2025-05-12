"use client";

import { useEffect, useState } from "react";
import Adtocart from "./Adtocart";
import { getAuth } from "firebase/auth";

export default function ProductDetailsButton({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setQuantity(1); // reset quantity on open
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isModalOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen]);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="text-white text-sm py-3 px-6 border-transparent bg-gradient-to-r from-white to-indigo-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        View Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div
            className="relative bg-white p-8 rounded-xl w-full max-w-4xl shadow-2xl transform transition-transform duration-500 ease-in-out"
            style={{
              transform: isModalOpen ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 text-3xl font-bold hover:text-red-500 transition"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={product.image1}
                  alt={product.name}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl border-4 border-white/30"
                />
              </div>

              {/* Product Details */}
              <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2 text-gray-900">
                  <div>
                    <h2 className="text-xl font-semibold">Product Name:</h2>
                    <p className="text-lg">{product.name}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Price:</h2>
                    <p className="text-lg text-yellow-500">
                      PKR {product.price}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Description:</h2>
                    <p className="text-sm text-gray-700">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decreaseQty}
                      className="w-10 h-10 bg-gray-100 text-black rounded-full text-2xl font-semibold hover:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQty}
                      className="w-10 h-10 bg-gray-100 text-black rounded-full text-2xl font-semibold hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Adtocart
                  product={{ ...product, quantity }}
                  userId={uid}
                  onAddToCartSuccess={closeModal}
                  className="py-3 text-center bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-teal-500 hover:to-green-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
