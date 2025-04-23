"use client";

import Navbar from "./Navbar";

export default function Adtocart({ product }) {
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // Update the quantity if product already exists
      cart[existingIndex].quantity += product.quantity;
      alert("Product quantity updated in the cart.");
    } else {
      // Add new product
      cart.push(product);
      alert("Item added to the cart successfully.");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="flex justify-center items-center">
      <Navbar/>
      <button
        onClick={handleAddToCart}
        className="bg-yellow-400 text-black py-2 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition"
      >
        Add To Cart
      </button>
    </div>
  );
}
