"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const categories = [
  {
    name: "See Mens Category",
    image: "/mensbanner.webp",
    route: "/Menscategory",
  },
  {
    name: "See Women Category",
    image: "/womensbanner.webp",
    route: "/Womenscategory",
  },
  {
    name: "See Kids Category",
    image: "/kidsbanner.jpeg",
    route: "/Kidscategory",
  },
  {
    name: "See Accessories Category",
    image: "/acceseroies.jpg",
    route: "/Acceserioescategory",
  },
];

export default function CategorySection() {
  const router = useRouter();

  const handleCategoryClick = (route) => {
    toast.success(`Loading ${route}`);
    router.push(route);
  };

  return (
    <div className="py-10 px-4" id="category">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Shop by Category
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.route)}
            className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden group shadow-md cursor-pointer transition-transform transform hover:scale-105"
          >
            {/* Category Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0  bg-opacity-70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-black text-sm font-bold bg-gray-100 px-2 py-1 rounded">
                {category.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
