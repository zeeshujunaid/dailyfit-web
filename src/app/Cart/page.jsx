"use client";

import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../utils/firebase";
import Navbar from "../../components/Navbar";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [uid, setUid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const router = useRouter();

  // Get the user ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch cart items after UID is available
  useEffect(() => {
    if (uid) {
      const cartKey = `cart-${uid}`;
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCartItems(storedCart);
    }
  }, [uid]);

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

    if (!uid) {
      toast.error("User not logged in");
      return;
    }

    if (!address || !street || !houseNumber || !city || !postalCode || !phone) {
  toast.error("Please fill in all fields");
  return;
}

const fullAddress = `${houseNumber}, ${street}, ${city}, ${postalCode}`;

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
        address: fullAddress,
        phone,
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
      // Remove the correct cart after order placed
      localStorage.removeItem(`cart-${uid}`);
      setCartItems([]);
      setShowModal(false);
      // router.push("/Cart");
    } catch (error) {
      console.error("Error saving order: ", error);
      toast.error("Something Went Wrong, Please Try Again Later.");
    }
  };

  const handleRemoveItem = (removeIndex) => {
    const updatedCart = cartItems.filter((_, index) => index !== removeIndex);
    setCartItems(updatedCart);

    if (uid) {
      localStorage.setItem(`cart-${uid}`, JSON.stringify(updatedCart));
    }

    toast.success("Item removed from cart");
  };

  return (
    <>
      <div className="bg-gray-100">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-red-600">Your Cart</h2>

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
              onClick={() => {
                if (!cartItems.length) return toast.error("Cart is empty");
                if (!cashOnDelivery)
                  return toast.error("Select payment method");
                setShowModal(true);
              }}
            >
              Next
            </button>
            {showModal && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Enter Your Details</h3>
                    <button
                      className="text-red-600 font-bold"
                      onClick={() => {
                        setShowModal(false);
                      }}
                    >
                      X
                    </button>
                  </div>

                  {/* Original Address Input */}
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  {/* New Structured Address Inputs */}
                  <input
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="text"
                    placeholder="House/Flat No."
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  {/* Original Phone Input */}
                  <input
                    type="number"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  <button
                    onClick={Handlebill}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
