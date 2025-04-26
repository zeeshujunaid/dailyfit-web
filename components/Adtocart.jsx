"use client";

import toast from "react-hot-toast";

export default function Adtocart({ product, onAddToCartSuccess, userId }) {
  const handleAddToCart = () => {
    if (!userId) {
      toast.error("Plz Login To Add Product To The Cart");
      return;
    }

    const cartKey = `cart-${userId}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // Update the quantity if product already exists
      cart[existingIndex].quantity += product.quantity;
      toast.success("Quantity has been updated");
    } else {
      // Add new product
      cart.push(product);
      toast.success("Item added to the cart successfully.");
      console.log(product)
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    console.log(cartKey)

    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleAddToCart}
        className="bg-yellow-400 text-black py-2 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition"
      >
        Add To Cart
      </button>
    </div>
  );
}
