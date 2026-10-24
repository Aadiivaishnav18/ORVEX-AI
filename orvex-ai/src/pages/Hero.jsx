
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <main className="w-full bg-black text-white">
      <section id="home" className="relative w-full">
        <img
          src={BG_IMG}
          alt="ORVEX-AI Background"
          className="block h-auto w-full"
        />
      </section>

      <Footer />
    </main>
  );
};

export default Hero;
