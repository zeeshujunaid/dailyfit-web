"use client";

import { useEffect, useState } from "react";
import ProductDetailsButton from "./detailsbutton";

export default function FeaturedProduct() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const rawData = localStorage.getItem("featuredproduct");

    if (rawData) {
      try {
        setProducts(JSON.parse(rawData));
      } catch (err) {
        console.error("Error parsing products:", err);
      }
    }
  }, []);

  const loadMoreProducts = () => {
    setVisibleCount((prev) => Math.min(prev + 8, products.length));
  };

  const hideProducts = () => {
    setVisibleCount(8);

    const section = document.getElementById("featured-products");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section id="featured-products" className="py-12 px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Featured Products
          </h2>

          <p className="text-gray-500 mt-2">
            Discover our most popular products.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">
            No featured products found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {products.slice(0, visibleCount).map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                      ⭐ Featured
                    </span>
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden rounded-t-3xl bg-gray-100">
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="flex flex-col justify-around">
                      <h3 className="text-lg font-bold font-mono text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                        {product.description ||
                          "Premium quality product crafted for style and comfort."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-semibold text-gray-900 gap-2 flex items-center">
                        <span className="text-gray-900">
                          PKR
                          </span>{product.price}
                      </span>

                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    </div>

                    {/* Existing Modal Button */}
                    <div className="mt-4">
                      <ProductDetailsButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center mt-12">
              {visibleCount < products.length ? (
                <button
                  onClick={loadMoreProducts}
                  className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-lg"
                >
                  See More Products ⬇
                </button>
              ) : products.length > 8 ? (
                <button
                  onClick={hideProducts}
                  className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg"
                >
                  Hide Products ⬆
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
