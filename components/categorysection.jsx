const categories = [
  { name: "See Mens Category", image: "/mensbanner.webp" },
  { name: "See Women Category", image: "/womensbanner.webp" },
  { name: "See Kids Category", image: "/kidsbanner.jpeg" },
  { name: "See Accessories Category", image: "/acceseroies.jpg" },
];

export default function CategorySection() {
  return (
    <div className="py-10 px-4" id="category">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Shop by Category
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden group shadow-md cursor-pointer transition-transform transform hover:scale-105"
          >
            {/* Category Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-grey bg-opacity-70 flex flex-col items-center text-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-black text-2xl font-bold font-inline bg-gray-100">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
