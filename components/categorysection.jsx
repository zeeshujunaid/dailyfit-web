const categories = [
    { name: "Men", image: "/mensbanner.webp" },
    { name: "Women", image: "/womensbanner.webp" },
    { name: "Kids", image: "/kidsbanner.jpeg" },
    { name: "Accessories", image: "/acceseroies.jpg" },
  ];
  
  export default function CategorySection() {
    return (
      <div className="flex flex-wrap justify-center gap-10 py-10 pt-30">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative w-40 h-40 rounded-full overflow-hidden group shadow-lg cursor-pointer"
          >
            {/* Category Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
  
            {/* Hover Overlay with Text */}
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-black text-2xl font-semibold bg-white">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  