"use client";

import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../utils/firebase";
import Navbar from "../../components/Navbar";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Importing uuid for unique order ID

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [uid, setUid] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [termandcondition, settermandcondition] = useState(false);
  const router = useRouter();

  // Get the user ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid,user.displayName);
      }
      console.log(auth.currentUser)
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

    if (!termandcondition) {
      toast.error("Please accept the terms and conditions");
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

      // Generate a unique order ID

      const newOrder = {
        orderId: orderId,
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
        instructions: instructions || "No special instructions",
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
    } catch (error) {
      console.error("Error saving order: ", error);
      toast.error("Something Went Wrong, Please Try Again Later.");
    }

    // Redirect to WhatsApp
    const whatsappNumber = "923058077535";

    const auth = getAuth();
    const customerName = auth.currentUser?.displayName || "Customer";

    const message = `Hi, I placed an order on your website.

👤 Name: ${customerName}
🆔 Order ID: ${orderId}
💰 Total Amount: PKR ${totalPrice}
📞 Phone: ${phone}

Please confirm my order. I am ready to complete the online payment.`;

    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };;

  const handleRemoveItem = (removeIndex) => {
    const updatedCart = cartItems.filter((_, index) => index !== removeIndex);
    setCartItems(updatedCart);

    if (uid) {
      localStorage.setItem(`cart-${uid}`, JSON.stringify(updatedCart));
    }

    toast.success("Item removed from cart");
  };

  const updateQuantity = (index, action) => {
    const updatedCart = [...cartItems];

    if (action === "increase") {
      updatedCart[index].quantity += 1;
    } else if (action === "decrease" && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }

    setCartItems(updatedCart);

    if (uid) {
      localStorage.setItem(`cart-${uid}`, JSON.stringify(updatedCart));
    }
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
              <h2 className="text-3xl font-bold text-red-600 whitespace-nowrap">
                Your Cart
              </h2>

              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 max-w-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-blue-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <p className="text-xs text-blue-800 leading-5">
                  <span className="font-semibold">Important:</span> After
                  placing your order, you'll be redirected to WhatsApp. Send
                  your <strong>Order ID</strong> and complete the payment to
                  confirm your order.
                </p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow text-gray-600 text-center">
                Your cart is empty.
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 p-5"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relatie">
                      <img
                        src={item.image1}
                        alt={item.name}
                        className="w-full md:w-36 h-56 object-cover rounded-2xl border border-gray-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-2">
                          {item.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                          Premium quality product with elegant finish and fast
                          delivery.
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            ● In Stock
                          </span>

                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            🚚 Fast Delivery
                          </span>

                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                            🔒 Secure Checkout
                          </span>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="flex flex-wrap justify-between items-end gap-5 mt-6">
                        {/* Quantity */}
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Quantity</p>

                          <div className="flex items-center rounded-xl overflow-hidden border shadow-sm">
                            <button
                              onClick={() => updateQuantity(index, "decrease")}
                              className="w-11 h-11 bg-gray-100 hover:bg-gray-200 transition text-xl font-bold"
                            >
                              −
                            </button>

                            <span className="w-12 text-center font-bold text-lg">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(index, "increase")}
                              className="w-11 h-11 bg-gray-100 hover:bg-gray-200 transition text-xl font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="px-5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:w-56">
                      <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 p-5 shadow-sm">
                        <p className="text-xs text-gray-500">Price For Each</p>

                        <h3 className="text-2xl font-bold mt-1 text-yellow-500">
                          PKR{" "}
                          <span className="text-gray-900">{item.price}</span>
                        </h3>

                        <div className="border-t my-4"></div>

                        <p className="text-sm text-gray-500">Total</p>

                        <h1 className="text-3xl font-extrabold text-red-600 mt-1">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </h1>

                        {/* <div className="mt-4 text-xs text-gray-500">
                          {item.quantity} × PKR {item.price}
                        </div> */}
                      </div>
                    </div>
                  </div>
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
                checked={termandcondition}
                onChange={(e) => settermandcondition(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="cod" className="text-gray-700 font-medium">
                Accept Terms and Conditions
              </label>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              onClick={() => {
                if (!cartItems.length) return toast.error("Cart is empty");

                if (!termandcondition)
                  return toast.error("Please accept the terms and conditions");

                // Generate random 6-digit Order ID
                const randomOrderId = Math.floor(
                  100000 + Math.random() * 900000,
                );
                setOrderId(randomOrderId.toString());

                setShowModal(true);
              }}
            >
              Next
            </button>
            {showModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-3 sm:p-5">
                  <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
                    {/* Header */}

                    <div className="sticky top-0 z-20 bg-white border-b px-6 py-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Secure Checkout
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Complete your shipping details.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowModal(false)}
                        className="h-10 w-10 rounded-full hover:bg-red-100 text-2xl text-gray-600 hover:text-red-600 transition"
                      >
                        ×
                      </button>
                    </div>

                    {/* Body */}

                    <div className="flex-1 overflow-y-auto">
                      <div className="grid lg:grid-cols-2 gap-8 p-6">
                        {/* LEFT */}

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Address
                            </label>

                            <input
                              type="text"
                              placeholder="Enter your full address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Street Name
                            </label>

                            <input
                              type="text"
                              placeholder="Street / Area"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City
                              </label>

                              <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Postal Code
                              </label>

                              <input
                                type="text"
                                placeholder="Postal Code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                House / Flat No.
                              </label>

                              <input
                                type="text"
                                placeholder="House No."
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                              </label>

                              <input
                                type="number"
                                placeholder="03XXXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Special Instructions
                              <span className="text-xs text-gray-400 ml-2">
                                (Optional)
                              </span>
                            </label>

                            <input
                              type="text"
                              placeholder="Example: Call before delivery..."
                              value={instructions}
                              onChange={(e) => setInstructions(e.target.value)}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div className="space-y-5">
                          <div className="rounded-2xl border bg-gray-50 p-6">
                            <h3 className="text-xl font-bold">Order Summary</h3>

                            <div className="space-y-4 mt-5">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Order ID</span>
                                <span className="font-bold text-green-600">
                                  ORD-{orderId}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500">Items</span>
                                <span className="font-semibold">
                                  {cartItems.length}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-semibold text-green-600">
                                  FREE
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500">Payment</span>
                                <span className="font-semibold">WhatsApp</span>
                              </div>

                              <hr />

                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>

                                <span className="text-3xl font-bold text-red-600">
                                  PKR {totalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex gap-3">
                              <div className="text-2xl">💬</div>

                              <p className="text-sm leading-6 text-yellow-800">
                                After placing your order you'll automatically
                                open our
                                <strong> WhatsApp </strong>
                                where you'll send your
                                <strong> Order ID </strong>
                                and complete your online payment.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl border p-3 bg-white text-center">
                              🚚
                              <p className="text-xs mt-2 font-semibold">
                                Fast Delivery
                              </p>
                            </div>

                            <div className="rounded-xl border p-3 bg-white text-center">
                              🔒
                              <p className="text-xs mt-2 font-semibold">
                                Secure
                              </p>
                            </div>

                            <div className="rounded-xl border p-3 bg-white text-center">
                              ⭐
                              <p className="text-xs mt-2 font-semibold">
                                Premium
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}

                    <div className="sticky bottom-0 bg-white border-t p-5">
                      <button
                        onClick={Handlebill}
                        className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-4 text-lg font-bold text-white shadow-lg hover:scale-[1.02] transition"
                      >
                        Place Order & Continue to WhatsApp →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
