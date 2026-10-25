
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Body from "./Body";
import Login from "./Login";
import Signup from "./SignUp";
import AuthListener from "./AuthListener";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

const Browse = () => (
  <AuthListener>
    <RouterProvider router={appRouter} />
  </AuthListener>
);

export default Browse;
