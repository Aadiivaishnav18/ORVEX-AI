
import { LOGO } from "../utils/constant";

const Header = () => {
  return (
    <header className="relative z-50 h-28 w-full bg-black/90 px-4 sm:px-6 lg:px-8">
      <nav className="flex h-full w-full items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <img
            className="h-18 w-auto object-contain transition duration-300 hover:scale-105"
            src={LOGO}
            alt="Orvex-AI Logo"
          />
        </div>

        {/* Navigation */}
        <div className="hidden items-center text-sm font-medium text-gray-300 md:flex">
          <ul className="flex items-center gap-8">
            <li className="cursor-pointer transition hover:text-cyan-400">
              Home
            </li>
            <li className="cursor-pointer transition hover:text-cyan-400">
              Features
            </li>
            <li className="cursor-pointer transition hover:text-cyan-400">
              About
            </li>
          </ul>
        </div>

        {/* Button */}
        <button className="rounded-lg border border-cyan-400/60 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 transition duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
          Get Started
        </button>

      </nav>
    </header>
  );
};

export default Header;
