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
        className="w-30 h-12 py-3 text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold text-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-300"
      >
        Add To Cart
      </button>
    </div>
  );
}
