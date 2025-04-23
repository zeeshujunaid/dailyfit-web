"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Go Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 bg-white text-blue-600 border border-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          ← Back to Home
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left - Cart Items */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Your Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow"
                >
                  <img
                    src={item.image1}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">
                    PKR {item.price * item.quantity}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Right - Bill Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Bill Summary</h2>

            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">PKR {item.price * item.quantity}</span>
              </div>
            ))}

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-red-600">PKR {totalPrice}</span>
            </div>

            {/* Cash on Delivery Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cod"
                checked={cashOnDelivery}
                onChange={(e) => setCashOnDelivery(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="cod" className="text-gray-700 font-medium">
                Cash on Delivery
              </label>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
