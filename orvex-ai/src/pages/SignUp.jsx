
import { useState } from "react";
import { Mail, LockKeyhole, UserRound } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Link } from "react-router-dom";

import { auth } from "../utils/firebase";
import { LOGIN_IMG } from "../utils/constant";
import { validationData } from "../utils/validation";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const message = validationData(name, email, password);

    if (message) {
      setError(message);
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

      // AuthListener updates Redux and Browse redirects to "/".
    } catch (err) {
      console.error("Signup error:", err.code, err.message);

      const messages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Please choose a stronger password.",
        "auth/operation-not-allowed":
          "Enable Email/Password in Firebase Authentication settings.",
        "auth/network-request-failed": "Check your internet connection.",
      };

      setError(
        messages[err.code] || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4 py-8 text-white">
      <img
        src={LOGIN_IMG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-black/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <Link to="/" className="mb-8 block text-center text-3xl font-extrabold">
          Orvex-<span className="text-cyan-400">AI</span>
        </Link>

        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-gray-300">
          Join your intelligent AI workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative">
            <UserRound
              size={20}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              aria-label="Full Name"
              autoComplete="name"
              required
              className="w-full rounded-xl border border-white/20 bg-black/50 py-4 pl-12 pr-4 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          <div className="relative">
            <Mail
              size={20}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              aria-label="Email Address"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-white/20 bg-black/50 py-4 pl-12 pr-4 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          <div className="relative">
            <LockKeyhole
              size={20}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-xl border border-white/20 bg-black/50 py-4 pl-12 pr-4 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 py-4 font-semibold text-black hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-400">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
