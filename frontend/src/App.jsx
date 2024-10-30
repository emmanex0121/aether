import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import Home from "./views/Home";
import { App as AntdApp } from "antd";
import Dashboard from "./views/Dashboard";
import ProtectedRoutes from "./ProtectedRoutes";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/signup",
      Component: SignUp,
    },
    {
      path: "/signin",
      Component: SignIn,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoutes>
          <Dashboard />
        </ProtectedRoutes>
      ),
    },
  ]);
  return (
    <AntdApp>
      <RouterProvider router={router} />
    </AntdApp>
  );
};

export default App;
