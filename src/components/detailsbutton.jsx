"use client";

import { useEffect, useState } from "react";
import Adtocart from "./Adtocart";
import { getAuth } from "firebase/auth";

export default function ProductDetailsButton({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
  ].filter(Boolean);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => {
    setCurrentImage(0);
    setQuantity(1);
    setIsModalOpen(true);
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
        className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 w-full"
      >
        View Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          {" "}
          <div
            className="relative bg-white rounded-[30px] w-[95%] sm:w-[90%] lg:w-[88%] xl:w-[80%] max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl"
            style={{
              transform: isModalOpen ? "translateY(0)" : "translateY(100%)",
              transition: ".35s",
            }}
          >
            {/* Close Button */}

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 h-11 w-11 rounded-full bg-white shadow-lg hover:bg-red-500 hover:text-white text-2xl transition"
            >
              ×
            </button>

            <div className="flex flex-col lg:flex-row gap-6 p-5 lg:p-6">
              {" "}
              {/* LEFT SIDE */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden bg-gray-100">
                  <img
                    src={images[currentImage]}
                    alt={product.name}
                    className="w-full h-[220px] sm:h-[320px] lg:h-[430px] object-contain bg-white"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImage((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-xl hover:scale-110 transition"
                      >
                        ←
                      </button>

                      <button
                        onClick={() =>
                          setCurrentImage((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-xl hover:scale-110 transition"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex justify-center gap-3 mt-5 flex-wrap">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`rounded-2xl overflow-hidden border-2 transition-all ${
                          currentImage === index
                            ? "border-yellow-500 scale-105 shadow-lg"
                            : "border-gray-200 hover:border-yellow-400"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-20 h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* RIGHT SIDE */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {product.name}
                  </h1>

                  <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
                    PKR {product.price}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      ● In Stock
                    </span>

                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                      🚚 Fast Delivery
                    </span>
                  </div>

                  <div className="mt-3">
                    <h2 className="font-bold text-xl mb-3">
                      Product Description
                    </h2>

                    <div className="bg-gray-50 rounded-2xl border p-5 text-gray-600 leading-7">
                      {product.description}
                    </div>
                  </div>

                  {/* Quantity */}

                  <div className="mt-4">
                    <h2 className="font-bold text-xl mb-3">Quantity</h2>

                    <div className="inline-flex items-center overflow-hidden rounded-2xl border shadow">
                      <button
                        onClick={decreaseQty}
                        className="w-12 h-12 text-2xl hover:bg-gray-100 transition"
                      >
                        −
                      </button>

                      <span className="w-16 text-center font-bold text-xl">
                        {quantity}
                      </span>

                      <button
                        onClick={increaseQty}
                        className="w-12 h-12 text-2xl hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                </div>

                {/* Add To Cart */}

                <div className="mt-5">
                  <Adtocart
                    product={{ ...product, quantity }}
                    userId={uid}
                    onAddToCartSuccess={closeModal}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
