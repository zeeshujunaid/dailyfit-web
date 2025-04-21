import Image from "next/image";

export default function Loader() {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff] dark:bg-black">
      <div className="flex flex-col items-center space-y-8 animate-fadeIn">
        
        {/* The DAILY FIT Text with Branding */}
        <div className="text-5xl sm:text-6xl font-bold">
          <span className="text-black">THE </span>
          <span className="text-red-600">DAILY</span>
          <span className="text-black"> FIT</span>
        </div>

        {/* Loading GIF */}
        <div className="animate-pulse">
          <Image
            src="/loader.gif"  // Replace with your loading GIF path
            alt="Loading Animation"
            width={150}
            height={150}
          />
        </div>

        {/* Loading Text */}
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">PLZ WAIT</p>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading your daily fit...</p>
      </div>
    </div>
  );
}
