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
      const collections = ["mensproduct", "womensproduct", "kidsproduct", "featuredproduct", "acceseroies"];
      let allDataFetched = true;

      for (let name of collections) {
        const querySnapshot = await getDocs(collection(db, name));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (data.length === 0) {
          allDataFetched = false;
          break;
        }

        localStorage.setItem(name, JSON.stringify(data));
      }

      if (allDataFetched) {
        console.log("✅ All collections saved to localStorage");
        localStorage.removeItem("retryCount"); // reset if success
        router.push("/Home");
      } else {
        handleRetry();
      }

    } catch (error) {
      console.error("❌ Error fetching collections:", error);
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
    <div className="flex items-center justify-center min-h-screen bg-[#fff] dark:bg-black">
      <div className="flex flex-col items-center space-y-8 animate-fadeIn">
        <div className="text-5xl sm:text-6xl font-bold">
          <span className="text-black">THE </span>
          <span className="text-red-600">DAILY</span>
          <span className="text-black"> FIT</span>
        </div>

        <div className="animate-pulse">
          <Image
            src="/loader.gif"
            alt="Loading Animation"
            width={150}
            height={150}
          />
        </div>

        {!error ? (
          <>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">PLZ WAIT</p>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading your daily fit...</p>
          </>
        ) : (
          <p className="text-xl font-semibold text-red-600 text-center">
            😔 HEY SOMETHING WENT WRONG<br />
            PLZ TRY AGAIN LATER.
          </p>
        )}
      </div>
    </div>
  );
}
