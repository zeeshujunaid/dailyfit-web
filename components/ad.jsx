export default function Ad() {
    return (
      <div
        className="relative h-60 w-full bg-cover bg-center rounded-xl overflow-hidden"
        style={{ backgroundImage: "url('/ad.png')" }}
        id="about"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-grey bg-opacity-40 flex flex-col items-center justify-center gap-8">
        <h1 className=" text-white text-4xl md:text-6xl font-bold text-center px-4">
            <span className="text-red-600">The</span> Daily <span className="text-red-600">Fit</span>
          </h1>
          <h5 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            We Dont Compromise On Our Quality And Pricing
          </h5>
        </div>
      </div>
    );
  }
  