"use client";

import Categorysection from "../../components/categorysection";
import Feautredcard from "../../components/Feautredcard";
import Navbar from "../../components/Navbar";

export default function HeroSection() {
  return (
    <div className="flex flex-col bg-white">
      {/* Mobile Hero */}
      <div
        className="
          relative
          block
          sm:hidden
          h-screen
          bg-no-repeat
          bg-contain
          bg-top
        "
        style={{
          backgroundImage: "url('/Mainposter-mobile.png')",
        }}
      >
        <Navbar />
      </div>

      {/* Desktop Hero */}
      <div
        className="
          relative
          hidden
          sm:block
          h-[110vh]
          md:h-screen
          bg-cover
          bg-center
          sm-pt-10
          sm-mt-10
        "
        style={{
          backgroundImage: "url('/Mainposter.png')",
        }}
      >
        <Navbar />
      </div>

      {/* Page Content */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 space-y-12 mt-12">
        <Categorysection />
        <Feautredcard />
      </div>
    </div>
  );
}
