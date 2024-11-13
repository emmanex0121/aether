import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import Home from "./views/Home";
import { App as AntdApp } from "antd";
import DashboardLayout from "./views/DashboardLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminProtectedRoutes from "./views/AdminProtectedRoutes";
import AdminDashboard from "./views/AdminDashboard";
import AdminSignIn from "./views/AdminSignIn";
import Plans from "./layout/Plans";
import Transaction from "./layout/Transaction";
import Wallet from "./layout/Wallet";
import Verification from "./layout/Verification";
import Profile from "./layout/Profile";
import Chat from "./layout/Chat";
import Logout from "./layout/Logout";
import DashboardContent from "./layout/DashboardContent";
import PlanSelect from "./layout/PlanSelect";

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
      path: "/user",
      // Component: Dashboard,
      element: (
        <ProtectedRoutes>
          <DashboardLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: "dashboard",
          element: <DashboardContent />,
        },
        {
          path: "plans",
          element: <Plans />,
          // children: [
          //   {
          //     path: "select",
          //     element: <PlanSelect />,
          //   },
          // ],
        },
        {
          path: "plans/select", // Make PlanSelect a sibling route of Plans
          element: <PlanSelect />,
        },
        {
          path: "transactions",
          element: <Transaction />,
        },
        {
          path: "wallet",
          element: <Wallet />,
        },
        {
          path: "verification",
          element: <Verification />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
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
