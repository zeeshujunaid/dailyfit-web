import Navbar from "../../../components/Navbar";

export default function HeroSection() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bbg.jpg')" }} // background image
    >
      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0  bg-opacity-40 z-0"></div>

      <Navbar />

      {/* Main Content */}
      <div className="flex justify-around items-center w-full h-full px-10 pt-20 text-white relative z-10">
        {/* Left Side: Text */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg">
            Discover amazing features, connect with awesome people, and explore the power of our service.
            Start your journey with us today.
          </p>
        </div>

        {/* Right Side: Image with ground shadow */}
        <div className="mt-20 relative">
          <img
            src="/boys.png"
            alt="Showcase"
            className="w-80 h-[80vh]"
          />
          {/* Fake shadow under feet */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-3 bg-black opacity-30 rounded-full blur-sm"></div>
        </div>
      </div>
    </div>
  );
}
