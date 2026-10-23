
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <div>
      <div className="w-full">
        <img
          className="block h-auto w-full object-contain"
          src={BG_IMG}
          alt="Background_Image"
        />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Hero;
