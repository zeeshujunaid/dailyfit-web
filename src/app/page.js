"use client";

import Image from "next/image";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../utils/firebase"; 

export default function Loader() {
  const router = useRouter();
  const [error, setError] = useState(false);

  const fetchAndSaveCollections = async () => {
    try {
      const collections = [
        "mens&womensproduct",
        "Mugs&glasses",
        "KitchenEssentials",
        "featuredproduct",
      ];

      for (const name of collections) {
        try {
          const querySnapshot = await getDocs(collection(db, name));

          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Empty array bhi save kar do
          localStorage.setItem(name, JSON.stringify(data));

          console.log(`✅ ${name}: ${data.length} products`);
        } catch (err) {
          console.error(`❌ ${name} failed`, err);

          // Error aaye to empty array save kar do
          localStorage.setItem(name, JSON.stringify([]));
        }
      }

      localStorage.removeItem("retryCount");
      router.push("/Home");
    } catch (error) {
      console.error(error);
      handleRetry();
    }
  };

  const handleRetry = () => {
    let retryCount = Number(localStorage.getItem("retryCount") || "0");
    if (retryCount < 2) {
      retryCount++;
      localStorage.setItem("retryCount", retryCount.toString());
      window.location.reload();
    } else {
      setError(true);
      localStorage.removeItem("retryCount");
    }
  };

  useEffect(() => {
    fetchAndSaveCollections();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-yellow-500 to-white">
      <div className="w-full max-w-md px-6 text-center">
        {/* Logo */}
        <div className="text-5xl sm:text-6xl font-extrabold tracking-wide">
          <span className="text-black">JUST </span>
          <span className="text-yellow-500">A CLICK</span>
        </div>

        <p className="mt-3 text-gray-500 text-sm tracking-[0.25em] uppercase">
          Everything You Need Is Just A Click Away
        </p>

        {/* Loader Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
          <div className="flex justify-center">
            <Image
              src="/justaclicklogo.png"
              alt="Loading"
              width={150}
              height={150}
              priority
            />
          </div>

          {!error ? (
            <>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Please Wait...
              </h2>

              <p className="mt-2 text-gray-500">
                We're preparing your shopping experience.
              </p>

              {/* Progress */}
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-red-600"></div>
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 text-5xl">📶</div>

              <h2 className="mt-4 text-2xl font-bold text-red-600">
                Connection Error
              </h2>

              <p className="mt-2 text-gray-500">
                Please check your internet connection and try again.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!error && (
          <p className="mt-8 text-xs text-gray-400">© 2026 Just A Click</p>
        )}
      </div>
      <div className="mt-8 h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 shadow-[0_0_15px_rgba(234,179,8,0.7)] animate-loading"></div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        .animate-loading {
          animation: loading 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
