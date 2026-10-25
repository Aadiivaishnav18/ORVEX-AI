
import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

const Hero = () => {
  return (
    <main className="w-full flex-1 bg-black text-white">
      <section
        id="home"
        className="w-full overflow-hidden"
      >
        <img
          src={BG_IMG}
          alt="Orvex-AI Banner"
          className="block h-auto min-h-[250px] w-full object-cover sm:min-h-0 sm:object-contain"
          onError={(event) => {
            console.error("Hero image failed to load:", BG_IMG);
            event.currentTarget.style.display = "none";
          }}
        />
      </section>

      <section id="features" className="px-6 py-12">
        <h2 className="text-center text-3xl font-bold text-cyan-400">
          Features
        </h2>
      </section>

      <section id="about" className="px-6 py-12">
        <h2 className="text-center text-3xl font-bold text-cyan-400">
          About Orvex-AI
        </h2>
      </section>

      <Footer />
    </main>
  );
};

export default Hero;
