// import { Card } from "antd";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../layout/SideBar";
import { UserOutlined } from "@ant-design/icons";

const DashboardLayout = () => {
  const location = useLocation(); // Get the current location
  const [selected, setSelected] = useState(
    () => localStorage.getItem("selectedTab") || "DashboardContent" // Load from localStorage or default
  );
  const [sideBarShow, setShowSideBar] = useState(false);

  useEffect(
    () => {
      // Map the current path to a sidebar item (e.g., "/plans" or any nested path like "/plans/plan1" will set "Plans")
      const pathMap = {
        "/dashboard": "DashboardContent",
        "/plans": "Plans",
        "user/transactions": "Transactions",
        "/wallet": "Wallet",
        "/verification": "Verification",
        "/profile": "Profile",
        "/chat": "Chat",
        "/logout": "Logout",
      };
      const matchedPath = Object.keys(pathMap).find((path) =>
        location.pathname.startsWith(path)
      );
      if (matchedPath) {
        setSelected(pathMap[matchedPath]);
        localStorage.setItem("selectedTab", pathMap[matchedPath]); // Save to localStorage
      }
    },
    [location.pathname],
    selected
  ); // Runs on location change

  useEffect(() => {
    // Save the selected tab to localStorage whenever it changes
    if (selected) {
      localStorage.setItem("selectedTab", selected);
      // console.log("Updated localStorage:", localStorage.getItem("selectedTab")); // Debug line
    }
  }, [selected]);

  // console.log("selec", selected); //debug line
  // console.log(localStorage.getItem("selectedTab")); // debug line

  const toggleSidebar = () => {
    if (!sideBarShow) {
      setShowSideBar(true);
    } else {
      setShowSideBar(false);
    }
  };

  return (
    <div className="min-h-[100vh]">
      <div className="flex items-center px-2 flex-row w-full h-16 mb-8 bg-gray-200 relative">
        <button
          onClick={toggleSidebar}
          className="carousel-btn sm:hidden bg-blue-500 text-white px-2 py-1 rounded">
          ☰
        </button>
        <NavLink
          to="profile"
          className="absolute right-0 mr-2"
          onClick={() => setSelected("Profile")}>
          <div className="rounded-full p-1 bg-amber-900">
            <UserOutlined style={{ fontSize: "24px", color: "#fff" }} />
          </div>
        </NavLink>
      </div>
      <div className=" px-2">
        <div className="min-w-20 w-40 fixed">
          <div className="">
            <SideBar
              toggleSideBar={toggleSidebar}
              sideBarShow={sideBarShow}
              setShowSideBar={setShowSideBar}
              selected={selected}
              setSelected={setSelected}
              currentPath={location.pathname}
            />
          </div>
        </div>
        {/* <div className="content-section ml-[17rem]">{renderContent()}</div> */}
        {/* Outlet will render the child routes/components */}
        <div className="content-section ml-[15.9rem] md:px-6 max-w-[1200px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
