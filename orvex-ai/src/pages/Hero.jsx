import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <div>
      <div className=" relative w-full">
        <img
          className="block h-auto w-full object-contain"
          src={BG_IMG}
          alt="Background_Image"
        />
      </div>

      <div className="absolute bottom-[-40px] left-1/2 z-10 -translate-x-1/2">
        <button className="h-10 w-28 rounded-lg border border-cyan-300/60 bg-cyan-500/10 text-sm font-semibold text-cyan-300 transition duration-100 hover:bg-cyan-400 hover:text-black cursor-pointer">
          Get Started
        </button>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Hero;
