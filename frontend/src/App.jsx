import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import Home from "./views/Home";
import { App as AntdApp } from "antd";
import Dashboard from "./views/Dashboard";

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
      Component: Dashboard,
    },
  ]);
  return (
    <AntdApp>
      <RouterProvider router={router} />
    </AntdApp>
  );
};

export default App;
