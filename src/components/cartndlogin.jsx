"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { app } from "../../utils/firebase";
import toast from "react-hot-toast";

export default function CartButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserInfo({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        });
        updateCartCount(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
        setCartCount(0);
      }
      setLoading(false);
    });

    // Listen for cart updates
    const handleCartUpdate = (e) => {
      if (userInfo?.uid) {
        setCartCount(e.detail?.count || 0);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [userInfo?.uid]);

  const updateCartCount = (uid) => {
    const key = `cart-${uid}`;
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setCartCount(stored.length);
  };

  const handleGoogleAuth = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("myOrders");
      localStorage.removeItem("userData"); 
      setShowDropdown(false);
      setIsLoggedIn(false);
      setUserInfo(null);
      setCartCount(0);

    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };
  
  if (loading) return null;

  return (
    <div className="flex space-x-6 items-center relative">
      {isLoggedIn ? (
        <>
          <button className="relative" onClick={() => router.push("/Cart")}>
            <ShoppingCart className="h-7 w-7 text-gray-800 hover:text-red-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <img
              src={userInfo?.photo}
              alt="User"
              className="h-8 w-8 rounded-full cursor-pointer border-2 border-gray-300 hover:border-red-500"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 p-4 space-y-2">
                <div className="text-sm font-semibold">{userInfo?.name}</div>
                <div className="text-xs text-gray-600">{userInfo?.email}</div>
                <hr />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-red-500 hover:underline text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </>
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
