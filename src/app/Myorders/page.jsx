"use client";

import { db } from "../../../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

export default function MyProfileAndOrders() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);

  // Listen to orders in real-time
  const listenToOrders = (userId) => {
    const userDocRef = doc(db, "orders", userId);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const newOrders = Array.isArray(data.orders) ? data.orders : [];

          setOrderData(newOrders);
          localStorage.setItem("myOrders", JSON.stringify(newOrders));
        } else {
          setOrderData([]);
          localStorage.setItem("myOrders", JSON.stringify([]));
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time order data:", error);
        toast.error("Failed to load orders.");
        setOrderData([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  // Auth state and fetch orders
  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        setUid(userId);

        // Real-time orders listener
        const unsubscribeOrders = listenToOrders(userId);

        return () => unsubscribeOrders();
      } else {
        setUid(null);
        setUserInfo(null);
        setOrderData([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Orders Section */}
      <div className="flex-1 mt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          My Orders
        </h1>

        {loading ? (
          <div className="text-center text-lg font-semibold">Loading...</div>
        ) : orderData.length === 0 ? (
          <div className="text-center text-lg font-semibold">
            No orders available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderData.map((order, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-all"
              >
                <div className="space-y-2">
                  {/* Status */}
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-700">Status:</div>
                    <div className="capitalize flex items-center gap-2">
                      {order.status}
                      {order.status === "delivering" && order.deliveryDate && (
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Delivery Date {order.deliveryDate}
                          </span>
                        </div>
                      )}
                      {order.status === "deleted" && (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Deleted
                        </span>
                      )}
                      {order.status === "delivered" && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Delivered
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex justify-between">
                    <div className="font-semibold text-gray-700">
                      Payment Method:
                    </div>
                    <div>{order.paymentMethod}</div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between">
                    <div className="font-semibold text-gray-700">
                      Total Amount:
                    </div>
                    <div className="text-green-600 font-bold">
                      ${order.totalAmount}
                    </div>
                  </div>

                  {/* Created At */}
                  {order.createdAt?.seconds && (
                    <div className="flex justify-between">
                      <div className="font-semibold text-gray-700">
                        Ordered On:
                      </div>
                      <div>
                        {new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  {Array.isArray(order.items) && order.items.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold mb-2 text-gray-800">
                        Items:
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-gray-700">
                            {item.name} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Delivery Date */}
                  {order.status === "delivering" &&
                    order.deliveryDate?.seconds && (
                      <div className="mt-4">
                        <div className="font-semibold text-green-600 mb-1">
                          DeliveryDate:
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
        )}
      </div>
    </div>
  );
}
