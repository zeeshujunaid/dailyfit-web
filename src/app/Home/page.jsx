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
    <div className="flex flex-col">
      {/* Hero Section */}
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <Navbar />

        {/* Hero Text */}
        <div className="flex items-center h-full px-6 md:px-16 pt-20 md:pt-32 relative z-10">
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
              Welcome To <span className="text-red-600">The</span>
              <span className="text-white">Daily</span>
              <span className="text-red-600">Fit</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl">
              Level up your everyday look with Daily Fit — stylish tees and cool accessories for men, women, and kids. Whether you're keeping it casual or making a statement, we've got your vibe. Fashion that fits your lifestyle — only at Daily Fit
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 md:px-8 lg:px-16 space-y-12 mt-12">
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
