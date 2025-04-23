"use client";

import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  // Smooth scroll to section by ID
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center px-4 z-10">
      <nav className="w-full max-w-7xl h-20 bg-white shadow-md rounded-2xl px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-red-600 cursor-pointer">
          THE<span className="text-gray-800">DAILY</span>FIT
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 text-lg font-medium">
          <button
            onClick={() => scrollToSection("#")}
            className="hover:text-red-500 transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("category")}
            className="hover:text-red-500 transition"
          >
            Category
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-red-500 transition"
          >
            About us
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="hover:text-red-500 transition"
          >
            Contact us
          </button>
        </div>

        {/* Cart Icon */}
        <div className="flex space-x-8 items-center">
          <button className="relative">
            <ShoppingCart className="h-8 w-8 text-gray-700 hover:text-red-500" />
          </button>
        </div>
      </nav>
    </div>
  );
}
