import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LOGO } from "../utils/constant";
import Logout from "./Logout";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((store) => store.user);

  const closeMenu = () => setMenuOpen(false);

  const GetStartedButton = ({ mobile = false }) => (
    <Link
      to="/login"
      onClick={closeMenu}
      className={`inline-flex items-center justify-center rounded-lg bg-amber-300 px-5 py-2.5 font-semibold text-black transition hover:bg-amber-200 ${
        mobile ? "w-full" : ""
      }`}
    >
      Get Started
    </Link>
  );

  return (
    <header className="relative z-50 w-full border-b border-white/10 bg-black/95">
      <nav className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        {/* Logo (left) */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Orvex-AI home"
          className="justify-self-start"
        >
          {LOGO ? (
            <img
              src={LOGO}
              alt="Orvex-AI"
              className="h-12 w-auto object-contain sm:h-14"
            />
          ) : (
            <span className="text-xl font-bold text-amber-300">
              Orvex-AI
            </span>
          )}
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center justify-center gap-8 text-sm text-gray-300 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="transition-colors hover:text-amber-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 justify-self-end md:flex">
          {user ? (
            <>
              <span className="max-w-40 truncate text-sm text-gray-300">
                {user.displayName || user.email}
              </span>
              <Logout />
            </>
          ) : (
            <GetStartedButton />
          )}
        </div>

        {/* Mobile menu */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center justify-self-end rounded-lg border border-amber-300/50 text-2xl text-amber-300 md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-4 py-4 md:hidden">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-2 text-gray-300 hover:text-amber-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="break-words text-sm text-gray-300">
                  {user.displayName || user.email}
                </span>
                <Logout />
              </div>
            ) : (
              <GetStartedButton mobile />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;