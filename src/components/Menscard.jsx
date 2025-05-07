"use client";

import { useEffect, useState } from "react";
import ProductDetailsButton from "./detailsbutton";
import {useRouter} from "next/navigation";

export default function Menscard() {
  const [products, setProducts] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    const rawData = localStorage.getItem("mensproduct");

    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);

        // Random shuffle
        const shuffled = parsed.sort(() => 0.6 - Math.random());

        // First 5 products
        const selected = shuffled.slice(0, 6);

        setProducts(selected);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-row items-center mb-2 w-full justify-between rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Mens Tshirts
        </h1>
        <button
          onClick={() => Router.push("Menscategory")}
          className="text-ml text-gray-600 text-black-800 text-center mb-4"
        >
          see more
        </button>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No Mens products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <img
                src={product.image1}
                alt={product.name}
                className="w-full h-36 object-cover rounded-t-xl"
              />

              {/* Product Info */}
              <div className="flex flex-col items-center space-y-2 p-2">
                <h2 className="text-sm font-semibold text-gray-800 text-center leading-tight">
                  {product.name}
                </h2>
                <div className="flex flex-row justify-around items-center w-full">
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
