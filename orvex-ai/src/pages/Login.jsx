
import { LOGIN_IMG } from "../utils/constant";
import { Mail, LockKeyhole } from "lucide-react";

const Login = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white md:flex-row">
      {/* Left Section */}
      <div className="relative flex min-h-[35vh] w-full overflow-hidden md:min-h-screen md:w-1/2 lg:w-[58%]">
        <img
          src={LOGIN_IMG}
          alt="Orvex-AI background"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-[#030712]/70" />

        {/* Branding Content */}
        <div className="relative z-10 flex w-full flex-col justify-end p-6 sm:p-10 lg:p-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-sm sm:tracking-[0.4em]">
            Welcome to
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Orvex-<span className="text-cyan-400">AI</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-gray-200 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            Your intelligent partner for a smarter tomorrow.
          </p>

          <div className="mt-6 h-1 w-24 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] sm:mt-8" />

          <p className="mt-4 text-[10px] tracking-wider text-gray-300 sm:mt-6 sm:text-xs">
            INNOVATE. AUTOMATE. EVOLVE.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex min-h-[65vh] w-full items-center justify-center px-4 py-8 sm:px-5 sm:py-10 md:min-h-screen md:w-1/2 lg:w-[42%]">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10">
          <h2 className="mb-2 text-3xl font-bold">Sign In</h2>

          <p className="mb-6 text-sm text-gray-400">
            Welcome back to Orvex-AI
          </p>

          <form
            className="space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email */}
            <div className="relative">
              <Mail
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-gray-700 bg-black/60 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <LockKeyhole
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-gray-700 bg-black/60 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 py-4 font-semibold text-black transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>New to Orvex? SignUp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
