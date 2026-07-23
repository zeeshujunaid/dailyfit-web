"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const categories = [
  {
    name: "Accessories",
    image: "/acceserioes.jpg",
    route: "/Mens&WomensAccessories",
    head: "Mens & Womens Accessories",
  },
  {
    name: "Drinkware",
    image: "/glassware.jpg",
    route: "/Mugs&Glasses",
    head: "Mugs & Glasses",
  },
  {
    name: "Kitchenware",
    image: "/kitchenware.jpg",
    route: "/KitchenEssentials",
    head: "Kitchen Essentials",
  },
];

export default function CategorySection() {
  const router = useRouter();

  const handleCategoryClick = (route) => {
    toast.success("Loading...");
    router.push(route);
  };

  return (
    <div className="py-10 px-4" id="category">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Shop by Category
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Category Image */}
            <div
              onClick={() => handleCategoryClick(category.route)}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg cursor-pointer group hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow">
                  {category.name}
                </span>
              </div>
            </div>

            {/* Heading Below Image */}
            <h2 className="mt-4 text-center text-lg font-bold text-gray-800">
              {category.head}
            </h2>

            {/* Optional Small Text */}
            <p className="text-sm text-gray-500 text-center mt-1">
              Explore Collection
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
