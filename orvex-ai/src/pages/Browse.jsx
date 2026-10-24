
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./Body";
import Login from "./Login";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const Browse = () => {
  return <RouterProvider router={appRouter} />;
};

export default Browse;
