"use client";

import { useEffect, useState } from "react";

export default function FeaturedProduct() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const [isModalOpen, setIsModalOpen] = useState(false); // State to open/close modal

  // Fetch the products from localStorage
  useEffect(() => {
    const rawData = localStorage.getItem("featuredproduct");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setProducts(parsed);
      } catch (err) {
        console.error("Error parsing featured product data:", err);
      }
    }
  }, []);

  // Handle the product click to open the modal
  const handleProductClick = (product) => {
    setSelectedProduct(product); // Set selected product
    setIsModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Add product to the cart (simplified for now)
  const handleAddToCart = () => {
    // Logic to add product to the cart (you can store this in localStorage or state)
    console.log("Product added to cart:", selectedProduct);
    closeModal(); // Close the modal after adding to cart
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Featured Products</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No featured products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-full mb-4">
                <img
                  src={product.image1}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg" // Full size image with fixed height
                />
              </div>
              <div className="w-full mt-4">
                <h2 className="text-2xl font-bold text-center">{product.name}</h2>
                <p className="text-gray-600 text-xl text-center">PKR {product.price}</p>
              </div>
              <button
                onClick={() => handleProductClick(product)} // Trigger the modal open
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for showing product details */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 md:w-1/3">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-xl hover:text-red-600 transition-colors"
            >
              X
            </button>
            <div className="flex justify-center mb-4">
              <img
                src={selectedProduct.image1}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <h2 className="text-3xl font-semibold text-white mb-2">{selectedProduct.name}</h2>
            <p className="text-xl text-white mb-4">PKR {selectedProduct.price}</p>
            <p className="text-white text-sm mb-6">{selectedProduct.description}</p>
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
