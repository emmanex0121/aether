import { useState } from "react";
import AdminSideBar from "../layout/AdminSideBar";
import { Carousel } from "antd"; // Ant Design Carousel
import DashBoardTable from "../layout/DashBoardTable";

const AdminDashboard = () => {
  const [sideBarShow, setSideBarShow] = useState(false);

  const toggleSideBar = () => {
    setSideBarShow((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <AdminSideBar
        sideBarShow={sideBarShow}
        toggleSideBar={toggleSideBar}
        setShowSideBar={setSideBarShow}
        selected={"AdminDashboard"}
        setSelected={() => {}} // Pass a function to manage selected item if needed
      />

      {/* Carousel */}
      {!sideBarShow && (
        <div className="fixed bottom-4 left-4 w-[90%] sm:w-1/2 z-10">
          <Carousel autoplay className="sm:!hidden">
            <div
              className="carousel-item bg-blue-300 p-4 rounded cursor-pointer"
              onClick={toggleSideBar}>
              <h3>Click here to open Sidebar</h3>
            </div>
            {/* <div
              className="carousel-item bg-green-300 p-4 rounded cursor-pointer"
              onClick={toggleSideBar}>
              <h3>More Admin Options</h3>
            </div>
            <div
              className="carousel-item bg-yellow-300 p-4 rounded cursor-pointer"
              onClick={toggleSideBar}>
              <h3>Manage Settings</h3>
            </div> */}
          </Carousel>
        </div>
      )}

      {/* Main Content */}

      <div className={`sm:pl-64 ${sideBarShow ? "sm:pl-64" : ""}`}>
        <h1 className="text-xl font-bold p-4">Admin Dashboard</h1>
        <p className="p-4">
          Welcome to the Admin Dashboard! Manage your settings and view reports
          here.
        </p>
      </div>

      <div className="sm:pl-64">
        <DashBoardTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
