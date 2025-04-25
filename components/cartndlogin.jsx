"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from "../utils/firebase";
import toast from "react-hot-toast";

export default function CartButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      setIsLoginModalOpen(false);
      router.push("/Cart");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  const handleSignup = async () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: signupName,
        email: signupEmail,
      });

      localStorage.setItem("userlogin", JSON.stringify(user.uid));


      toast.success("Signup successful!");
      setIsSignupModalOpen(false);
      router.push("/Cart");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google!");
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(false);
      router.push("/Cart");
    } catch (error) {
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
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-2 text-white rounded-lg text-sm font-semibold shadow-md"
        >
          Login to proceed
        </button>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white p-8 rounded-2xl w-[90%] max-w-md shadow-xl">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-5 text-black text-2xl font-bold hover:text-red-500"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-red-600">THE <span className="text-gray-800">DAILY</span> FIT</h2>
              <p className="text-sm text-gray-500">Login to access your cart</p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
              >
                Login
              </button>
              <div className="text-center text-sm text-gray-500">or</div>
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition"
              >
                Sign in with Google
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Don’t have an account?{" "}
                <span
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsSignupModalOpen(true);
                  }}
                  className="text-red-600 hover:underline cursor-pointer font-medium"
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white p-8 rounded-2xl w-[90%] max-w-md shadow-xl">
            <button
              onClick={() => setIsSignupModalOpen(false)}
              className="absolute top-4 right-5 text-black text-2xl font-bold hover:text-red-500"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-red-600">Create Account</h2>
              <p className="text-sm text-gray-500">Join The Daily Fit</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleSignup}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
              >
                Sign up
              </button>
              <div className="text-center text-sm text-gray-500">or</div>
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition"
              >
                Continue with Google
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsSignupModalOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="text-red-600 hover:underline cursor-pointer font-medium"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
