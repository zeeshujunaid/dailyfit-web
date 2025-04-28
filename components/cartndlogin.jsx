"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../utils/firebase";
import toast from "react-hot-toast";

export default function CartButton() {
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

  if (loading) return null;

  const handleGoogleAuth = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // optional: user details directly
      console.log("User Info:", {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      });

      toast.success("Signed in successfully!");
      router.push("/Cart"); // ya jis page pe bhejna ho
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="flex space-x-6 items-center">
      {isLoggedIn ? (
        <button className="relative" onClick={() => router.push("/Cart")}>
          <ShoppingCart className="h-7 w-7 text-gray-800 hover:text-red-500 transition" />
        </button>
      ) : (
        <button
          onClick={handleGoogleAuth}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-2 text-white rounded-lg text-sm font-semibold shadow-md"
        >
          Sign In / Sign Up with Google
        </button>
      )}
    </div>
  );
}
