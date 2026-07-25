"use client";

import Cartndlogin from "./cartndlogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-center px-2 sm:px-4 z-50 relative py-2 sm:py-4">
        <nav className="w-full max-w-7xl h-16 sm:h-16 md:h-20 bg-white shadow-md rounded-2xl px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <div
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/Home")}
          >
            <img
              src="/justaclicklogo.png"
              alt="Just A Click Logo"
              className="h-10 sm:h-14 md:h-20 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
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

            {/* Desktop Categories */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="flex items-center gap-1 h-16 hover:text-red-500 transition">
                Categories
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
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

          {/* Desktop Right */}
          <div className="hidden sm:block">
            <Cartndlogin />
          </div>

          {/* Mobile Right */}
          <div className="flex sm:hidden items-center gap-3">
            {/* <Cartndlogin /> */}

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </div>
      {/* Mobile Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 w-80 max-w-[85%] h-screen bg-white shadow-2xl z-50 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <img
                src="/justaclicklogo.png"
                alt="Just A Click Logo"
                className="h-12 w-auto object-contain"
              />

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={26} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5">
              <button
                onClick={() => {
                  router.push("/Home");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-4 border-b hover:text-red-500 transition"
              >
                🏠 Home
              </button>

              <button
                onClick={() => {
                  scrollToSection("about");
                }}
                className="w-full text-left py-4 border-b hover:text-red-500 transition"
              >
                ℹ️ About Us
              </button>

              {/* Mobile Categories */}
              <div className="border-b">
                <button
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="w-full flex items-center justify-between py-4 hover:text-red-500 transition"
                >
                  <span>📂 Categories</span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      mobileCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCategoryOpen && (
                  <div className="pb-3 pl-4 flex flex-col">
                    <button
                      onClick={() => {
                        router.push("/Mens&WomensAccessories");
                        setIsMenuOpen(false);
                      }}
                      className="text-left py-2 hover:text-red-500"
                    >
                      👜 Mens & Womens Accessories
                    </button>

                    <button
                      onClick={() => {
                        router.push("/Mugs&Glasses");
                        setIsMenuOpen(false);
                      }}
                      className="text-left py-2 hover:text-red-500"
                    >
                      ☕ Mugs & Glasses
                    </button>

                    <button
                      onClick={() => {
                        router.push("/KitchenEssentials");
                        setIsMenuOpen(false);
                      }}
                      className="text-left py-2 hover:text-red-500"
                    >
                      🍴 Kitchen Essentials
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  router.push("/Myorders");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-4 border-b hover:text-red-500 transition"
              >
                📦 My Orders
              </button>

              {/* Login / Cart */}
              <div className="mt-8">
                <Cartndlogin />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}