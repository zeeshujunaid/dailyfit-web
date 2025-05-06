"use client";
import Cartndlogin from "./cartndlogin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="flex justify-center px-2 sm:px-4 z-10 relative">
      <nav className="w-full max-w-7xl h-16 sm:h-20 bg-white shadow-md rounded-2xl px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="text-base sm:text-xl md:text-2xl font-bold text-red-600 cursor-pointer"
          onClick={() => router.push("/Home")}
        >
          THE<span className="text-gray-800">DAILY</span>FIT
        </div>

        {/* Navigation Links */}
        <div className="hidden sm:flex gap-2 sm:gap-6 text-xs sm:text-sm font-medium items-center text-gray-700">
          <button
            onClick={() => router.push("/Home")}
            className="hover:text-red-500 transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-red-500 transition"
          >
            About us
          </button>
          <button
            onClick={() => router.push("/Myorders")}
            className="hover:text-red-500 transition"
          >
            My Orders
          </button>
        </div>

        {/* Cart or Login */}
        <div className="scale-90 sm:scale-100">
          <Cartndlogin />
        </div>
      </nav>
    </div>
  );
}
