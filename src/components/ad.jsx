export default function Ad() {
  return (
    <div
      className="relative h-64 md:h-80 lg:h-96 w-full bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1350&q=80')",
      }}
      id="about"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-wide">
          <span className="text-red-600">The</span> Daily <span className="text-red-600">Fit</span>
        </h1>
        <h5 className="text-white text-lg sm:text-2xl md:text-3xl font-medium max-w-2xl">
          Bold Looks. Premium Quality. Everyday Confidence.
        </h5>
      </div>
    </div>
  );
}
