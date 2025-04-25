"use client";

import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../utils/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navbar from "../../../components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const Handlebill = async () => {
    if (!cartItems.length) {
      toast.error("Your Cart Is Empty");
      return;
    }

    if (!cashOnDelivery) {
      toast.error("Please select a payment method");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (!uid) {
      toast.error("User not logged in");
      return;
    }

    const userOrdersRef = doc(db, "orders", uid);

    try {
      const docSnap = await getDoc(userOrdersRef);

      const newOrder = {
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        totalAmount: totalPrice,
        paymentMethod: "Cash on Delivery",
        status: "pending",
        createdAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(userOrdersRef, {
          orders: arrayUnion(newOrder),
        });
      } else {
        await setDoc(userOrdersRef, {
          orders: [newOrder],
        });
      }

      toast.success("Your Order Has Been Placed");
      localStorage.removeItem("cart");
      setCartItems([]);
      router.push("/Cart");
    } catch (error) {
      console.error("Error saving order: ", error);
      toast.error("Something Went Wrong, Please Try Again Later.");
    }
  };


  const handleRemoveItem = (removeIndex) => {
  const updatedCart = cartItems.filter((_, index) => index !== removeIndex);
  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  toast.success("Item removed from cart");
};

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-red-600">
              <button
                onClick={() => router.push("/")}
                className="mb-6 bg-white text-red-800 px-2 py-1 rounded-lg font-medium"
              >
                ←
              </button>
              Your Cart
            </h2>
            {cartItems.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow text-gray-600 text-center">
                Your cart is empty.
              </div>
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
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="mt-2 text-sm text-red-600 font-medium hover:underline"
                    >
                      Remove This Item
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-red-600">
                    PKR {item.price * item.quantity}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Right - Bill Summary */}
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              Bill Summary
            </h2>

            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  PKR {item.price * item.quantity}
                </span>
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
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="cod" className="text-gray-700 font-medium">
                Cash on Delivery
              </label>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              onClick={Handlebill}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
