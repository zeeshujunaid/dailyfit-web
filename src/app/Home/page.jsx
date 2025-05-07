import Acceserioescard from "../../../components/Acceserioes";
import Ad from "../../../components/ad";
import Categorysection from "../../../components/categorysection";
import Feautredcard from "../../../components/Feautredcard";
import Kidscard from "../../../components/Kidscard";
import Menscard from "../../../components/Menscard";
import Navbar from "../../../components/Navbar";
import Womenscard from "../../../components/womenscard";

export default function HeroSection() {
  return (
    <div className="flex flex-col bg-[#f7f4f4]">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[60vh] sm:min-h-[70vh] md:min-h-screen"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <Navbar />

        {/* Hero Text */}
        <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 md:px-16 pt-20 sm:pt-24 md:pt-32 h-full">
          <div className="max-w-3xl text-white space-y-4 sm:space-y-6 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Welcome To <span className="text-red-600">The</span>
              <span className="text-white">Daily</span>
              <span className="text-red-600">Fit</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200">
              Level up your everyday look with Daily Fit — stylish tees and cool
              accessories for men, women, and kids. Whether you're keeping it
              casual or making a statement, we've got your vibe. Fashion that
              fits your lifestyle — only at Daily Fit.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 space-y-12 mt-12">
        <Categorysection />
        <Feautredcard />
        <Menscard />
        <Ad />
        <Womenscard />
        <Kidscard />
        <Acceserioescard />
      </div>
    </div>
  );
}
