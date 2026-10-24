
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <main className="flex flex-1 flex-col bg-black text-white">
      <section
        id="home"
        className="w-full"
      >
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
