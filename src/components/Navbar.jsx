"use client";

import Cartndlogin from "./cartndlogin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="flex justify-center px-2 sm:px-4 z-50 relative py-2 sm:py-4">
      <nav className="w-full max-w-7xl h-10 sm:h-15 bg-white shadow-md rounded-2xl px-6 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <div
          className="cursor-pointer flex items-center h-full"
          onClick={() => router.push("/Home")}
        >
          <img
            src="/justaclicklogo.png"
            alt="Just A Click Logo"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Navigation */}
        <div className="hidden sm:flex gap-6 text-sm font-medium items-center text-gray-700">
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

          {/* Categories */}
          <div
            className="relative flex items-center h-full"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 h-16 hover:text-red-500 transition">
              Categories
              <span
                className={`text-xs transition-transform duration-300 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 top-[calc(100%-2px)] w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                {" "}
                <button
                  onClick={() => {
                    router.push("/Mens&WomensAccessories");
                    setIsCategoryOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 transition"
                >
                  👜 Mens & Womens Accessories
                </button>
                <button
                  onClick={() => {
                    router.push("/Mugs&Glasses");
                    setIsCategoryOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 transition"
                >
                  ☕ Mugs & Glasses
                </button>
                <button
                  onClick={() => {
                    router.push("/KitchenEssentials");
                    setIsCategoryOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 transition"
                >
                  🍴 Kitchen Essentials
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/Myorders")}
            className="hover:text-red-500 transition"
          >
            My Orders
          </button>
        </div>

        {/* Cart/Login */}
        <div className="scale-90 sm:scale-100">
          <Cartndlogin />
        </div>
      </nav>
    </div>
  );
}
