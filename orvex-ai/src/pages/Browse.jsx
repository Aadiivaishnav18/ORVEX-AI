import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import Body from "./Body";
import Login from "./Login";
import Signup from "./SignUp";
import AuthListener from "./AuthListener";
import DashBoard from "../components/DashBoard";
import { auth } from "../utils/firebase";

// Refresh ke baad Firebase ko saved login restore karne mein thoda time lagta hai.
// Tab tak redux ka `user` null hota hai. Isliye guards pehle Firebase ke jawab
// ka wait karte hain, aur tabhi redirect ka faisla lete hain.
const useAuthStatus = () => {
  const user = useSelector((store) => store.user);
  const [checked, setChecked] = useState(() => Boolean(auth.currentUser));

  useEffect(() => {
    if (checked) return undefined;
    return onAuthStateChanged(auth, () => setChecked(true));
  }, [checked]);

  return {
    // user redux mein aa gaya ho to wait karne ki zaroorat nahi
    checked: checked || Boolean(user),
    // redux late ho tab bhi auth.currentUser sahi batata hai
    signedIn: Boolean(user || auth.currentUser),
  };
};

const AuthLoader = () => (
  <div className="flex h-dvh w-full items-center justify-center bg-black">
    <div
      role="status"
      aria-label="Loading"
      className="h-8 w-8 rounded-full border-2 border-white/10 border-t-cyan-400 motion-safe:animate-spin"
    />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { checked, signedIn } = useAuthStatus();

  if (!checked) return <AuthLoader />;
  return signedIn ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { checked, signedIn } = useAuthStatus();

  if (!checked) return <AuthLoader />;
  return signedIn ? <Navigate to="/dashboard" replace /> : children;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const Browse = () => (
  <AuthListener>
    <RouterProvider router={appRouter} />
  </AuthListener>
);

export default Browse;