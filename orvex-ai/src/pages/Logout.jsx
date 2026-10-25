
import { signOut } from "firebase/auth";
import { useState } from "react";
import { auth } from "../utils/firebase";

const Logout = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setError("");
    setLoading(true);

    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={handleLogout}
        className="rounded-lg bg-cyan-400 px-5 py-2 font-semibold text-black hover:bg-cyan-300 disabled:opacity-60"
      >
        {loading ? "Signing out..." : "Logout"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Logout;
