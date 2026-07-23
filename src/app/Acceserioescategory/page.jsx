"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProductDetailsButton from "../../components/detailsbutton";
import { useRouter } from "next/navigation";

export default function Acceseroiescard() {
  const [products, setProducts] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    const rawData = localStorage.getItem("acceseroies");

    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setProducts(parsed);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No Kids products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center mt-6">
          {products.map((product) => (
           <div
                             key={product.id}
                             className="relative bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                           >
                             {/* Featured Badge */}
                             <div className="absolute top-4 left-4 z-10">
                               <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                                 ⭐ Featured
                               </span>
                             </div>
           
                             {/* Wishlist */}
                             <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors duration-300">
                               ❤
                             </button>
           
                             {/* Image */}
                             <div className="bg-gray-100 rounded-t-3xl">
                               <img
                                 src={product.image1}
                                 alt={product.name}
                                 className="w-full h-60 object-cover"
                               />
                             </div>
           
                             {/* Details */}
                             <div className="p-5">
                               <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[56px]">
                                 {product.name}
                               </h3>
           
                               <p className="mt-2 text-sm text-gray-500 line-clamp-2 min-h-[42px]">
                                 {product.description ||
                                   "Premium quality product crafted for style and comfort."}
                               </p>
           
                               {/* Price + Stock */}
                               <div className="flex items-center justify-between mt-5">
                                 <div>
                                   <p className="text-xs text-gray-400 uppercase tracking-wide">
                                     Price
                                   </p>
           
                                   <h4 className="text-2xl font-bold text-gray-900">
                                     <span className="text-yellow-500 text-lg">PKR </span>
                                     {product.price}
                                   </h4>
                                 </div>
           
                                 <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                                   ● In Stock
                                 </span>
                               </div>
           
                               {/* Divider */}
                               <div className="border-t border-gray-100 my-5"></div>
           
                               {/* Existing Modal Button */}
                               <ProductDetailsButton product={product} />
                             </div>
                           </div>
          ))}
        </div>
      )}
    </div>
  );
}
