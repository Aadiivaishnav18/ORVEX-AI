
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../utils/firebase";
import { LOGIN_IMG } from "../utils/constant";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err.code, err.message);

      const messages = {
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/network-request-failed": "Check your internet connection.",
        "auth/operation-not-allowed":
          "Enable Email/Password in Firebase Authentication settings.",
      };

      setError(
        messages[err.code] || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-black text-white md:flex-row">

      {/* LEFT IMAGE AND BRANDING */}
      <section className="relative flex h-[280px] w-full shrink-0 overflow-hidden bg-[#030712] sm:h-[340px] md:sticky md:top-0 md:h-screen md:w-1/2 md:flex-1 lg:w-[58%]">

        <img
          src={LOGIN_IMG}
          alt="Orvex-AI background"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#030712]/90 md:bg-gradient-to-r md:from-black/30 md:via-black/10 md:to-[#030712]/70" />

        <div className="relative z-10 flex w-full flex-col justify-end p-5 sm:p-8 md:p-10 lg:p-16">
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
      </section>

      {/* RIGHT LOGIN FORM */}
      <section className="flex min-h-[calc(100vh-280px)] w-full flex-1 items-center justify-center bg-[#030712] px-4 py-8 sm:px-6 sm:py-10 md:min-h-screen md:w-1/2 md:px-8 lg:w-[42%] lg:flex-none lg:px-12">

        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-8 lg:p-10">

          <h2 className="mb-2 text-3xl font-bold">
            Sign In
          </h2>

          <p className="mb-6 text-sm text-gray-400">
            Welcome back to Orvex-AI
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="relative">
              <Mail
                size={20}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                aria-label="Email Address"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-gray-700 bg-black/60 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <LockKeyhole
                size={20}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-gray-700 bg-black/60 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-4 font-semibold text-black transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <p className="mt-6 text-center text-xs text-gray-400 sm:text-sm">
            New to Orvex?{" "}
            <Link
              to="/signup"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
