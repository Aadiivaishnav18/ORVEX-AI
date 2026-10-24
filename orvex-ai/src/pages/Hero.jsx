
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <main className="w-full bg-black text-white">
      <section
        id="home"
        className="relative h-[calc(100svh-64px)] w-full overflow-hidden sm:h-[calc(100svh-80px)] lg:h-auto"
      >
        <img
          src={BG_IMG}
          alt="ORVEX-AI Background"
          className="block h-full w-full object-cover object-center lg:h-auto lg:object-contain"
        />
      </section>

      <Footer />
    </main>
  );
};

export default Hero;
