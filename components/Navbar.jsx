"use client";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast"; 
import Cartndlogin from "./cartndlogin";

export default function Navbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("myOrders");
      localStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center px-4 z-50">
      <nav className="w-full max-w-7xl h-20 bg-white/80 dark:bg-gray-900/80 shadow-xl backdrop-blur-lg rounded-2xl px-6 flex items-center justify-between transition-all duration-300">
        
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center space-x-2 text-4xl font-extrabold"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <span
            className="text-transparent bg-clip-text"
            style={{
              background: "linear-gradient(to right, #E4A4C6, #A77EB1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            The
          </span>
          <span className="text-gray-900 dark:text-white">Daily</span>
          <span
            className="text-transparent bg-clip-text"
            style={{
              background: "linear-gradient(to right, #E4A4C6, #333)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fit
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-300 text-[17px] font-medium">
          <button
            onClick={() => router.push("/")}
            className="hover:text-[#E4A4C6] focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
          >
            Home
          </button>
          <button
            onClick={() => router.push("Home") || scrollToSection("category")}
            className="hover:text-[#E4A4C6] focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
          >
            Category
          </button>
          <button
            onClick={() => router.push("Home") || scrollToSection("about")}
            className="hover:text-[#E4A4C6] focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
          >
            About us
          </button>
          <button
            onClick={() => router.push("/Myorders")}
            className="hover:text-[#E4A4C6] focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
          >
            My Orders
          </button>
        </div>

        {/* Sign Out Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="bg-[#E4A4C6] hover:bg-[#d891ba] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#E4A4C6]"
          >
            Sign Out
          </button>

          {/* Cart or Login */}
          <Cartndlogin />
        </div>
      </nav>
    </div>
  );
}
