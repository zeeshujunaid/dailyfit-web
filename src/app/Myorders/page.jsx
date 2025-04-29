"use client";

import { db } from "../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../../components/Navbar";

export default function MyProfileAndOrders() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch orders by UID
  const handleMyOrders = async (userId) => {
    try {
      const userDocRef = doc(db, "orders", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        console.log(data)
        const newOrders = Array.isArray(data.orders) ? data.orders : [];

        if (JSON.stringify(orderData) !== JSON.stringify(newOrders)) {
          setOrderData(newOrders);
          localStorage.setItem("myOrders", JSON.stringify(newOrders));
        }
      } else {
        setOrderData([]);
        localStorage.setItem("myOrders", JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error fetching user order data:", error);
      setOrderData([]);
      localStorage.setItem("myOrders", JSON.stringify([]));
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auth listener and load orders
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
        console.log(userId)
        setUid(userId);
        setUserInfo({
          name: user.displayName || "User",
          email: user.email,
          photo: user.photoURL,
        });

        const ordersFromStorage = localStorage.getItem("myOrders");
        console.log(ordersFromStorage)
        if (ordersFromStorage) {
          setOrderData(JSON.parse(ordersFromStorage));
          setLoading(false);
        } else {
          await handleMyOrders(userId);
        }
      } else {
        console.log("User not logged in");
        setUid(null);
        setUserInfo(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Profile Section */}
      <div className="flex flex-col items-center bg-white p-6 shadow-md rounded-lg mx-4 mt-6">
        {userInfo ? (
          <div className="flex flex-col items-center space-y-4">
            {userInfo.photo ? (
              <img
                src={userInfo.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-400"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-300 flex items-center justify-center text-white text-2xl font-bold">
                {userInfo.name.charAt(0)}
              </div>
            )}
            <div className="text-center">
              <h2 className="text-2xl font-bold">{userInfo.name}</h2>
              <p className="text-gray-600">{userInfo.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Please log in to see profile.</p>
        )}
      </div>

      {/* Orders Section */}
      <div className="flex-1 mt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">My Orders</h1>

        {loading ? (
          <div className="text-center text-lg font-semibold">Loading...</div>
        ) : orderData.length === 0 ? (
          <div className="text-center text-lg font-semibold">No orders available</div>
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
                      {order.status === "delivered" && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Delivered
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex justify-between">
                    <div className="font-semibold text-gray-700">Payment Method:</div>
                    <div>{order.paymentMethod}</div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between">
                    <div className="font-semibold text-gray-700">Total Amount:</div>
                    <div className="text-green-600 font-bold">${order.totalAmount}</div>
                  </div>

                  {/* Created At */}
                  {order.createdAt?.seconds && (
                    <div className="flex justify-between">
                      <div className="font-semibold text-gray-700">Ordered On:</div>
                      <div>
                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  {Array.isArray(order.items) && order.items.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold mb-2 text-gray-800">Items:</div>
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
                  {order.status === "delivering" && order.deliveryDate?.seconds && (
                    <div className="mt-4">
                      <div className="font-semibold text-green-600 mb-1">
                        Delivery Date:
                      </div>
                      <div className="text-gray-700">
                        {new Date(order.deliveryDate.seconds * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-gray-400 text-sm p-4">
        &copy; {new Date().getFullYear()} Your App Name. All rights reserved.
      </div>
    </div>
  );
}
