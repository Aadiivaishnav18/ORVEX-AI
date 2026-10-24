
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <main className="w-full bg-black text-white">
      <section
        id="home"
        className="h-[380px] w-full overflow-hidden sm:h-auto"
      >
        <img
          src={BG_IMG}
          alt="ORVEX-AI Banner"
          className="h-full w-full object-cover object-center sm:h-auto sm:object-contain"
        />
      </section>

      <Footer />
    </main>
  );
};

export default Hero;
