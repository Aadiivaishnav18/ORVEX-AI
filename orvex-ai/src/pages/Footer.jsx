
const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-black px-5 py-5 sm:py-6">
      <p className="text-center text-[10px] leading-relaxed tracking-wide text-gray-400 sm:text-sm">
        Copyright © {new Date().getFullYear()} Aditya Vaishnav.
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
