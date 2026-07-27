"use client";

import { db } from "../../../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { getDoc, updateDoc } from "firebase/firestore";
import Cartandlogin from "../../components/cartndlogin";

export default function MyProfileAndOrders() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uid, setUid] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Listen to orders in real-time
 const listenToOrders = (userId) => {
   const userDocRef = doc(db, "orders", userId);

   return onSnapshot(
     userDocRef,
     (docSnap) => {
       if (docSnap.exists()) {
         const data = docSnap.data();
         setOrderData(data.orders || []);
       } else {
         setOrderData([]);
       }

       console.log("Real-time order data:", docSnap.data());
       setLoading(false);
     },
     (error) => {
       console.error(error);
       setOrderData([]);
       setLoading(false);
     },
   );
 };

  // Auth state and fetch orders
 useEffect(() => {
   const auth = getAuth();

   const unsubscribeAuth = auth.onAuthStateChanged((user) => {
     if (user) {
       setIsLoggedIn(true);
       setUid(user.uid);
       setLoading(true);

       listenToOrders(user.uid);
     } else {
       setIsLoggedIn(false);
       setUid(null);
       setOrderData([]);
       setLoading(false);
     }
   });

   return () => unsubscribeAuth();
 }, []);

  

  const handleDelete = async (orderId, uid) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order from your history?",
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      const orderDocRef = doc(db, "orders", uid);
      const orderDocSnap = await getDoc(orderDocRef);

      if (!orderDocSnap.exists()) {
        toast.error("Order not found");
        return;
      }

      const existingOrders = orderDocSnap.data().orders || [];

      const updatedOrders = existingOrders.filter(
        (order) => order.orderId !== orderId,
      );

      await updateDoc(orderDocRef, {
        orders: updatedOrders,
      });

      // UI update without refresh
      setOrderData(updatedOrders);

      toast.success("Order history deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

 return (
   <div className="flex flex-col min-h-screen bg-gray-100">
     <Navbar />

     <div className="flex-1 mt-8 px-4  pb-20">
       {loading ? (
         <div className="flex justify-center items-center py-20">
           <h1 className="text-2xl font-semibold text-gray-700">Loading...</h1>
         </div>
       ) : !isLoggedIn ? (
         <div className="flex flex-col items-center justify-center py-20">
           <h1 className="text-4xl font-bold text-gray-800">
             Please Login First
           </h1>

           <p className="text-gray-500 mt-3 text-lg">
             Login to view your orders.
           </p>
           <div className="mt-5">
             <Cartandlogin />
           </div>
         </div>
       ) : orderData.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20">
           <h1 className="text-4xl font-bold text-gray-800">
             You Didn't Order Yet
           </h1>

           <p className="text-gray-500 mt-3 text-lg">
             Hurry up! Order your favourite products now.
           </p>

           <button
             onClick={() => router.push("/Home")}
             className="mt-8 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
           >
             Shop Now
           </button>
         </div>
       ) : (
         <>
           <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
             My Orders
           </h1>

           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
             {orderData.map((order, index) => (
               <div
                 key={index}
                 className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
               >
                 {/* Header */}
                 <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 p-5">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-xs uppercase tracking-wider text-black/70">
                         Order ID
                       </p>

                       <h2 className="text-lg font-bold text-black">
                         {order.orderId}
                       </h2>
                     </div>

                     <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow">
                       📦
                     </div>
                   </div>
                 </div>

                 <div className="p-5 space-y-5">
                   {/* Status */}

                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 font-medium">
                       Order Status
                     </span>

                     <span
                       className={`px-3 py-1 rounded-full text-xs font-bold capitalize
            ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
            }`}
                     >
                       {order.status}
                     </span>
                   </div>

                   {/* Payment */}

                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Payment</span>

                     <span className="font-semibold text-gray-800">
                       {order.paymentMethod}
                     </span>
                   </div>

                   {/* Total */}

                   <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                     <p className="text-sm text-gray-500">Total Amount</p>

                     <h2 className="mt-1 text-3xl font-extrabold text-red-600">
                       PKR {order.totalAmount}
                     </h2>
                   </div>

                   {/* Date */}

                   {order.createdAt?.seconds && (
                     <div className="flex items-center justify-between">
                       <span className="text-gray-500">Ordered On</span>

                       <span className="font-semibold">
                         {new Date(
                           order.createdAt.seconds * 1000,
                         ).toLocaleDateString("en-US")}
                       </span>
                     </div>
                   )}

                   {/* Items */}

                   {order.items?.length > 0 && (
                     <div>
                       <h3 className="font-bold text-gray-900 mb-3">
                         Order Items
                       </h3>

                       <div className="space-y-3">
                         {order.items.map((item, idx) => (
                           <div
                             key={idx}
                             className="flex items-center justify-between rounded-xl bg-gray-50 border p-3"
                           >
                             <div>
                               <h4 className="font-semibold text-gray-800">
                                 {item.name}
                               </h4>

                               <p className="text-xs text-gray-500">
                                 Quantity : {item.quantity}
                               </p>
                             </div>

                             <div className="text-right">
                               <p className="font-bold text-red-600">
                                 PKR {item.total}
                               </p>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Delivery */}

                   {order.status === "delivering" && order.deliveryDate && (
                     <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                       <p className="text-sm text-green-700 font-semibold">
                         🚚 Expected Delivery
                       </p>

                       <p className="mt-1 text-lg font-bold text-gray-900">
                         {order.deliveryDate}
                       </p>
                     </div>
                   )}
                   {order.status === "completed" && (
                     <button
                       disabled={isDeleting}
                       onClick={() => handleDelete(order.orderId, uid)}
                       className="mt-3 w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                     >
                       {isDeleting ? "Deleting..." : "🗑 Delete Order History"}
                     </button>
                   )}
                   {/* Cancel */}

                   {order.status === "cancelled" && (
                     <button
                       onClick={() => handleDelete(order.orderId, uid)}
                       className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
                     >
                       Delete Order
                     </button>
                   )}
                 </div>
               </div>
             ))}
           </div>
         </>
       )}
     </div>
   </div>
 );
}
