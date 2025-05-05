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
      setIsDropdownOpen(false); // Close dropdown after click
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex justify-center px-4 z-10 relative">
      <nav className="w-full max-w-7xl h-20 bg-white shadow-md rounded-2xl px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-red-600 cursor-pointer">
          THE<span className="text-gray-800">DAILY</span>FIT
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 text-lg font-medium items-center relative">
          <button
            onClick={() => router.push("/")}
            className="hover:text-red-500 transition"
          >
            Home
          </button>

          {/* Category with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:text-red-500 transition"
            >
              Category
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-40 z-50">
                <button
                  onClick={() => scrollToSection("category")}
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                >
                  Category 1
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                >
                  Category 2
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                >
                  Category 3
                </button>
              </div>
            )}
          </div>

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
        <Cartndlogin />
      </nav>
    </div>
  );
}
