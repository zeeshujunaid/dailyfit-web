"use client";

import toast from "react-hot-toast";

export default function Adtocart({ product, onAddToCartSuccess, userId }) {
  const handleAddToCart = () => {
    if (!userId) {
      toast.error("Please login to add products to the cart.");
      return;
    }

    const cartKey = `cart-${userId}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += product.quantity;
      toast.success("Quantity updated in the cart.");
    } else {
      cart.push(product);
      toast.success("Item added to the cart.");
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    // 🔥 Dispatch custom event to notify cart button
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: { count: cart.length } })
    );

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
