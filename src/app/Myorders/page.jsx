"use client";

import { db } from "../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../../components/Navbar";

export default function MyOrders() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve useruid from localStorage
  const useruid = localStorage.getItem("useruid");

  // Function to handle fetching orders from Firestore
  const handleMyOrders = async () => {
    if (!useruid) {
      toast.error("Plz Login To See Your Orders Details");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "orders", useruid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const newOrders = Array.isArray(data.orders) ? data.orders : [];

        // Only update the state and localStorage if the orders are different
        if (JSON.stringify(orderData) !== JSON.stringify(newOrders)) {
          setOrderData(newOrders);
          localStorage.setItem("myOrders", JSON.stringify(newOrders)); // Store new data in localStorage
        }
      } else {
        setOrderData([]);
        localStorage.setItem("myOrders", JSON.stringify([])); // Clear localStorage if no orders found
      }
    } catch (error) {
      console.error("Error fetching user order data:", error);
      setOrderData([]);
      localStorage.setItem("myOrders", JSON.stringify([])); // Clear on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when the component mounts or when the user state changes
  useEffect(() => {
    const ordersFromStorage = localStorage.getItem("myOrders");

    if (ordersFromStorage) {
      setOrderData(JSON.parse(ordersFromStorage)); // Get orders from localStorage
      setLoading(false);
    } else {
      handleMyOrders(); // Fetch orders from Firebase
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  if (orderData.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        <Navbar/>
        No orders available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full px-4">
        {orderData.map((order, index) => (
          <div
            key={index}
            className="border p-6 rounded-lg shadow-md bg-white relative"
          >
            <div className="space-y-2 mt-4">
              {/* Status and Payment Method */}
              <div className="flex justify-between items-center">
                <div className="font-semibold">Status:</div>
                <div className="text-gray-700 capitalize flex items-center gap-2">
                  {order.status}
                  {order.status === "delivering" && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Delivering
                    </span>
                  )}
                  {order.status === "deleted" && (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Deleted
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="font-semibold">Payment Method:</div>
                <div className="text-gray-700">{order.paymentMethod}</div>
              </div>

              <div className="flex justify-between">
                <div className="font-semibold">Total Amount:</div>
                <div className="text-green-600 font-bold">
                  ${order.totalAmount}
                </div>
              </div>

              {order.createdAt?.seconds && (
                <div className="flex justify-between">
                  <div className="font-semibold">Created At:</div>
                  <div className="text-gray-700">
                    {new Date(
                      order.createdAt.seconds * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Items */}
              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="mt-4">
                  <div className="font-semibold mb-2 flex flex-col">
                    Items:
                  </div>
                  <ul className="list-disc list-inside space-y-1 flex  flex-col">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-gray-700">
                        {item.name} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Delivery Date */}
              {order.status === "delivering" && order.deliveryDate?.seconds && (
                <div className="mt-4">
                  <div className="font-semibold mb-2 text-green-600">
                    Your item will be delivered on:
                  </div>
                  <div className="text-gray-700">
                    {new Date(
                      order.deliveryDate.seconds * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
