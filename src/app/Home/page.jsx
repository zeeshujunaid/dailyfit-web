"use client";

import Categorysection from "../../components/categorysection";
import Feautredcard from "../../components/Feautredcard";
import Navbar from "../../components/Navbar";

export default function HeroSection() {
  return (
    <div className="flex flex-col bg-[#fff]">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[60vh] sm:min-h-[80vh] md:min-h-screen"
        style={{
          backgroundImage: "url('/Mainposter.png')",
        }}
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black/50 z-0"></div> */}

        {/* Navbar */}
        <Navbar />

        {/* Hero Text */}
        {/* <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 md:px-16 pt-20 sm:pt-24 md:pt-32 h-full">
          <div className="max-w-4xl text-white space-y-5 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="text-red-500">Elevate</span> Your Style with{" "}
              <span className="text-red-500">The</span>
              <span className="text-white">Daily</span>
              <span className="text-red-500">Fit</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200">
              Discover premium fashion that fits your vibe — from street-ready
              tees to everyday essentials, crafted for comfort, confidence, and
              individuality. Whether you're chasing trends or setting them,
              DailyFit keeps you one step ahead.
            </p>

            <div className="pt-4">
              <h2 className="text-white text-xl sm:text-2xl font-medium italic">
                "Style isn’t just what you wear — it’s how you own it."
              </h2>
            </div>
          </div>
        </div> */}
      </div>

      {/* Page Content */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 space-y-12 mt-12">
        <Categorysection />
        <Feautredcard />
      </div>
    </div>
  );
}
