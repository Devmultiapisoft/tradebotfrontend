import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { closeSideBar } from "../library/store/sidebar";
import "../assets/css/menu.css"; // Make sure you have the appropriate CSS
import { DashboardIcon, LogoutIcon, SettingsIcon, TradingIcon } from "../assets/icons";

export default function SideBar() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerState = useSelector((state) => state.sidebar.value);
  const dispatch = useDispatch();

  useEffect(() => {
    setDrawerVisible(drawerState);
  }, [drawerState]);

  const menuItems = [
    { name: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },
    { name: "Trading", route: "/trading", icon: <TradingIcon /> },
    { name: "Settings", route: "/settings", icon: <SettingsIcon /> },
    { name: "Logout", route: "/login", icon: <LogoutIcon /> },
  ];

  const renderMenuItems = () =>
    menuItems.map((item, index) => (
      <NavLink
        key={index}
        to={item.route}
        className="menu-item"
        activeClassName="active-menu"
      >
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-text">{item.name}</span>
      </NavLink>
    ));

  return (
    <>
      {/* Sidebar for Mobile */}
      <Sidebar
        visible={drawerVisible}
        onHide={() => dispatch(closeSideBar())}
        style={{ width: "250px" }}
        className="mobile-sidebar"
      >
        {renderMenuItems()}
      </Sidebar>

      {/* Sidebar for Desktop */}
      <div className="desktop-sidebar">
        <div className="sidebar-content">{renderMenuItems()}</div>
      </div>
    </>
  );
}
