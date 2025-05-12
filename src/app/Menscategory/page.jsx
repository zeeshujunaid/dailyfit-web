"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProductDetailsButton from "../../components/detailsbutton";
import { useRouter } from "next/navigation";

export default function Menscard() {
  const [products, setProducts] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    const rawData = localStorage.getItem("mensproduct");

    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setProducts(parsed);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg">No Kids products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center mt-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] bg-white rounded-xl shadow-md overflow-hidden p-4"
            >
              {/* Product Image */}
              <img
                src={product.image1}
                alt={product.name}
                className="w-full h-36 object-cover rounded-t-xl"
              />

              {/* Product Info */}
              <div className="flex flex-col items-center space-y-2 mt-4">
                <h2 className="text-sm font-semibold text-gray-800 text-center leading-tight">
                  {product.name}
                </h2>
                <div className="flex flex-row justify-between items-center w-full mt-2">
                  <p className="text-green-600 text-sm font-medium">
                    PKR {product.price}
                  </p>
                  <ProductDetailsButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
