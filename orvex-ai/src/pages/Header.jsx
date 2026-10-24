
import { useState } from "react";
import { LOGO } from "../utils/constant";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-50 w-full border-b border-cyan-950/60 bg-black/95">
      <nav className="flex min-h-20 items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0"
          aria-label="Orvex-AI home"
        >
          {LOGO ? (
            <img
              src={LOGO}
              alt="Orvex-AI Logo"
              className="h-12 w-auto object-contain sm:h-14 lg:h-16"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-xl font-bold text-cyan-400">
              Orvex-AI
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 text-sm text-gray-300 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Get Started */}
        <Link
          to="/login"
          className="hidden h-10 items-center justify-center rounded-lg border border-cyan-400/60 bg-cyan-500/10 px-5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400 hover:text-black md:inline-flex"
        >
          Get Started
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/50 text-cyan-300 transition-colors hover:bg-cyan-400/10 md:hidden"
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`grid overflow-hidden border-t border-cyan-950/60 bg-black transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="px-4 pb-4">
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex h-10 w-full items-center justify-center rounded-lg border border-cyan-400/60 bg-cyan-500/10 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-400 hover:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
