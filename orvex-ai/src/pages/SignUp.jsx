import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, LockKeyhole } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../utils/firebase";
import { LOGIN_IMG } from "../utils/constant";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/60 py-3.5 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";

const labelClass = "mb-2 block text-sm text-neutral-300";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Signup error:", err.code, err.message);

      const messages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must contain at least 6 characters.",
        "auth/operation-not-allowed":
          "Enable Email/Password in Firebase Authentication settings.",
        "auth/network-request-failed": "Check your internet connection.",
      };

      setError(
        messages[err.code] ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-dvh w-full bg-[#030712] text-white md:grid-cols-2 lg:grid-cols-[1.2fr_1fr]">

      <section className="relative isolate h-80 overflow-hidden bg-[#030712] sm:h-96 md:sticky md:top-0 md:h-dvh">
        {LOGIN_IMG && (
          <img
            src={LOGIN_IMG}
            alt="Orvex-AI background"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/30 to-[#030712] md:bg-gradient-to-r md:from-black/20 md:via-black/20 md:to-[#030712]" />

        <div className="flex h-full flex-col justify-end p-5 pb-24 sm:p-8 sm:pb-28 md:p-10 lg:p-16">
          <p className="mb-1 text-sm font-medium text-cyan-400 md:mb-3">
            Welcome to
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Orvex-<span className="text-cyan-400">AI</span>
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-300 sm:text-base md:mt-5 lg:text-lg lg:leading-7">
            Your intelligent partner for a smarter tomorrow.
          </p>

          <div className="mt-8 hidden items-center gap-4 md:flex">
            <div className="h-1 w-20 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.6)]" />
            <p className="text-sm text-neutral-400">
              Innovate. Automate. Evolve.
            </p>
          </div>
        </div>
      </section>

      {/* SIGNUP FORM */}
      <section className="relative z-10 -mt-16 flex items-start justify-center px-4 pb-12 sm:-mt-20 sm:px-6 md:mt-0 md:min-h-dvh md:items-center md:px-8 md:py-10 lg:px-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#071022] p-6 shadow-2xl sm:p-8 lg:p-10">
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
            Create account
          </h2>

          <p className="mb-6 text-sm text-neutral-400">
            Join Orvex-AI and start your journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* NAME */}
            <div>
              <label htmlFor="signup-name" className={labelClass}>
                Full name
              </label>
              <div className="relative">
                <UserRound size={20} aria-hidden="true" className={iconClass} />
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="signup-email" className={labelClass}>
                Email address
              </label>
              <div className="relative">
                <Mail size={20} aria-hidden="true" className={iconClass} />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="signup-password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={20}
                  aria-hidden="true"
                  className={iconClass}
                />
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-400 py-3.5 font-semibold text-black transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-amber-400 transition hover:text-amber-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;