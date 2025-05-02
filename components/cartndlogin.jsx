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
      router.push("/Cart"); // Redirect to Cart or any other page
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="flex space-x-6 items-center">
      {isLoggedIn ? (
        <button
          onClick={() => router.push("/Cart")}
          className="relative group flex items-center justify-center p-2 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#E4A4C6]"
        >
          <ShoppingCart className="h-8 w-8 text-gray-800 group-hover:text-red-500 transition duration-300" />
        </button>
      ) : (
        <button
          onClick={handleGoogleAuth}
          className="bg-gradient-to-r from-[#E4A4C6] to-[#A77EB1] hover:from-[#A77EB1] hover:to-[#E4A4C6] transition-all duration-300 px-6 py-3 text-white text-sm font-semibold rounded-lg shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#E4A4C6]"
        >
          Sign In / Sign Up with Google
        </button>
      )}
    </div>
  );
}
