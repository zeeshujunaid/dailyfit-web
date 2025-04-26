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
      if (user) {
        setUid(user.uid);
      }
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
        className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 transition duration-300"
      >
        View Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
          <div className="relative bg-white/20 border border-white/30 backdrop-blur-2xl p-6 rounded-2xl w-[90%] max-w-md shadow-xl text-white">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-white text-2xl font-bold hover:text-red-400"
            >
              ×
            </button>

            {/* Product Image */}
            <div className="flex justify-center mb-4">
              <img
                src={product.image1}
                alt={product.name}
                className="w-full h-52 object-cover rounded-xl shadow-md border border-white/20"
              />
            </div>

            {/* Name and Price in Row */}
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-lg font-semibold text-yellow-300">
                PKR {product.price}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-100 text-center mb-4 px-2">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={decreaseQty}
                className="w-8 h-8 bg-white/20 text-white rounded-full text-lg font-bold hover:bg-white/30"
              >
                −
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={increaseQty}
                className="w-8 h-8 bg-white/20 text-white rounded-full text-lg font-bold hover:bg-white/30"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            {/* The product and quantity will only be added to the cart when the user clicks on this button */}
            <Adtocart
              product={{ ...product, quantity }}
              userId={uid}
              onAddToCartSuccess={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
