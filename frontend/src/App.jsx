import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import Home from "./views/Home";
import { App as AntdApp } from "antd";
import Dashboard from "./views/Dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminProtectedRoutes from "./views/AdminProtectedRoutes";
import AdminDashboard from "./views/AdminDashboard";
import AdminSignIn from "./views/AdminSignIn";

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
    {
      path: "/admin/signin",
      Component: AdminSignIn,
    },
    {
      path: "/admin/dashboard",
      element: (
        <AdminProtectedRoutes>
          <AdminDashboard />
        </AdminProtectedRoutes>
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
