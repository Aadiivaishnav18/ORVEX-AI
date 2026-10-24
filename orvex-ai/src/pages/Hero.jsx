
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <main className="w-full bg-black text-white">
      {/* Hero Section */}
      <section id="home" className="relative w-full">
        {/* Background Image */}
        <img
          src={BG_IMG}
          alt="ORVEX-AI Background"
          className="block h-auto w-full"
        />

        {/* Get Started Button */}
        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
          <button
            type="button"
            className="h-9 w-28 rounded-lg border border-cyan-300/60 bg-black px-3 text-xs font-semibold text-cyan-300 transition-colors duration-200 hover:bg-cyan-400 hover:text-black sm:h-10 sm:w-32 sm:text-sm"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Separate Footer */}
      <section className="mt-8 w-full">
        <Footer />
      </section>
    </main>
  );
};

export default Hero;
