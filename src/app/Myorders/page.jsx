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
    try {
      const orderDocRef = doc(db, 'orders', uid);
      const orderDocSnap = await getDoc(orderDocRef);
  
      if (orderDocSnap.exists()) {
        const existingOrders = orderDocSnap.data().orders || [];
        const updatedOrders = existingOrders.filter(
          (order) => order.orderId !== orderId // <-- use orderId here
        );
  
        await updateDoc(orderDocRef, { orders: updatedOrders });
        toast.success('Order deleted successfully');
      } else {
        toast.error('Order document does not exist');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };
  

 return (
   <div className="flex flex-col min-h-screen bg-gray-100">
     <Navbar />

     <div className="flex-1 mt-8 px-4">
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
             <Cartandlogin/>
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
                         <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                           Delivery Date {order.deliveryDate}
                         </span>
                       )}

                       {order.status === "cancelled" && (
                         <>
                           <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                             Order Cancelled
                           </span>

                           {isDeleting ? (
                             <span className="text-xs text-gray-500">
                               Deleting...
                             </span>
                           ) : (
                             <button
                               onClick={() => handleDelete(order.orderId, uid)}
                               className="bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                             >
                               Delete Order
                             </button>
                           )}
                         </>
                       )}

                       {order.status === "delivered" && (
                         <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                           Delivered
                         </span>
                       )}
                     </div>
                   </div>

                   {/* Payment */}
                   <div className="flex justify-between">
                     <span className="font-semibold text-gray-700">
                       Payment Method:
                     </span>
                     <span>{order.paymentMethod}</span>
                   </div>

                   {/* Amount */}
                   <div className="flex justify-between">
                     <span className="font-semibold text-gray-700">
                       Total Amount:
                     </span>

                     <span className="text-green-600 font-bold">
                       ${order.totalAmount}
                     </span>
                   </div>

                   {/* Ordered Date */}
                   {order.createdAt?.seconds && (
                     <div className="flex justify-between">
                       <span className="font-semibold text-gray-700">
                         Ordered On:
                       </span>

                       <span>
                         {new Date(
                           order.createdAt.seconds * 1000,
                         ).toLocaleDateString()}
                       </span>
                     </div>
                   )}

                   {/* Items */}
                   {order.items?.length > 0 && (
                     <div className="mt-4">
                       <div className="font-semibold mb-2 text-gray-800">
                         Items:
                       </div>

                       <ul className="list-disc list-inside space-y-1">
                         {order.items.map((item, idx) => (
                           <li key={idx}>
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
                         <div className="font-semibold text-green-600">
                           Delivery Date
                         </div>

                         <div>
                           {new Date(
                             order.deliveryDate.seconds * 1000,
                           ).toLocaleDateString()}
                         </div>
                       </div>
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
