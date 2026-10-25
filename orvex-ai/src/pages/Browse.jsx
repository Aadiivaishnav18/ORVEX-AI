
import {
  createBrowserRouter,
  RouterProvider, ProtectedRoute
} from "react-router-dom";

import Body from "./Body";
import Login from "./Login";
import Signup from "./SignUp";
import AuthListener from "./AuthListener";
import DashBoard  from "../components/DashBoard";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element:
    <ProtectedRoute>
     <Body />
     </ProtectedRoute>,
  },
  {
    path: "/login",
    element:
    <ProtectedRoute>
     <Login />
     </ProtectedRoute>,
  },
  {
    path: "/signup",
    element:
    <ProtectedRoute>
    <Signup />
    </ProtectedRoute>
  },

  {
    path: "/dashboard",
    element: 
     <ProtectedRoute>
    <DashBoard />
    </ProtectedRoute>
  }
]);

const Browse = () => (
  <AuthListener>
    <RouterProvider router={appRouter} />
  </AuthListener>
);

export default Browse;
