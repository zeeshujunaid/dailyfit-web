"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../utils/firebase";

export default function () {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // Prevent hydration issues

  return (
    <div className="flex space-x-8 items-center">
      {isLoggedIn ? (
        <button className="relative" onClick={() => router.push("/Cart")}>
          <ShoppingCart className="h-8 w-8 text-gray-700 hover:text-red-500" />
        </button>
      ) : (
        <button
          onClick={() => router.push("/Login")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Login to proceed to cart
        </button>
      )}
    </div>
  );
}
