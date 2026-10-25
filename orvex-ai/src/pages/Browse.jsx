import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Body from "./Body";
import Login from "./Login";
import Signup from "./SignUp";
import AuthListener from "./AuthListener";
import DashBoard from "../components/DashBoard";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user);

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const user = useSelector((store) => store.user);

  return user ? <Navigate to="/dashboard" replace /> : children;
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