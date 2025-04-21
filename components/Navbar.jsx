import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="flex justify-center px-4 ">
      <nav className="w-full max-w-7xl h-20 bg-white shadow-md rounded-2xl px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-red-600">
          THE<span className="text-gray-800">DAILY</span>FIT
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 text-lg font-medium">
          <a href="#" className="hover:text-red-500 transition">Home</a>
          <a href="#" className="hover:text-red-500 transition">Shop</a>
          <a href="#" className="hover:text-red-500 transition">About</a>
          <a href="#" className="hover:text-red-500 transition">Contact</a>
        </div>

        {/* Icons */}
        <div className="flex space-x-8 items-center">
          <button className="relative">
            <ShoppingCart className="h-8 w-8 text-gray-700 hover:text-red-500" />
            {/* Badge (optional) */}
            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span> */}
          </button>
        </div>
      </nav>
    </div>
  );
}
