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
                  className="relative bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                      ⭐ Featured
                    </span>
                  </div>

                  {/* Wishlist */}
                  <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors duration-300">
                    ❤
                  </button>

                  {/* Image */}
                  <div className="bg-gray-100 rounded-t-3xl">
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="w-full h-60 object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[56px]">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 min-h-[42px]">
                      {product.description ||
                        "Premium quality product crafted for style and comfort."}
                    </p>

                    {/* Price + Stock */}
                    <div className="flex items-center justify-between mt-5">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">
                          <span className="text-yellow-500 text-lg">PKR </span>
                          {product.price}
                        </h4>
                      </div>

                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                        ● In Stock
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-5"></div>

                    {/* Existing Modal Button */}
                    <ProductDetailsButton product={product} />
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
