import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../assets/dash.png";
import Message from "../assets/mess.png";
import Messageg from "../assets/messagegrey.png";
import Dashboardg from "../assets/dashboardgrey.png";
import User from "../assets/userss.png";
import Userg from "../assets/usersgrey.png";
import Settings from "../assets/settings.png";
import SettingsWhite from "../assets/settingsw.png";
import Logo from "../assets/logo.png";
import Logout from "../assets/logout.png";
import { logout } from "../store/UserSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(location.pathname);

  const links = [
    {
      path: "/dashboard",
      icon: Dashboard,
      NoneActiveIcon: Dashboardg,
      label: "Dashboard",
    },
    {
      path: "/filter",
      icon: Message,
      NoneActiveIcon: Messageg,
      label: "Search and Filter SDR",
    },
    { path: "/users", icon: User, NoneActiveIcon: Userg, label: "Users" },
    {
      path: "/profile",
      icon: SettingsWhite,
      NoneActiveIcon: Settings,
      label: "Profile Settings",
    },
  ];

  const handleClick = (choice) => {
    setSelectedChoice(choice);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-between w-72 h-full py-10 fixed px-5 border-r bg-white z-10">
      <div className="flex justify-center items-center">
        <img className="w-16 text-center" src={Logo} alt="Logo" />
      </div>
      <div className="space-y-7 -mt-20 w-full">
        {links.map((link) => {
          const isActive = selectedChoice === link.path;
          return (
            <NavLink
              key={link.path}
              className={`flex items-center gap-3 text-sm w-full relative py-4 px-3 rounded-md font-bold transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500 text-white"
                  : "bg-transparent text-gray-500"
              }`}
              to={link.path}
              activeClassName="active-link"
              onClick={() => handleClick(link.path)}
            >
              <img
                className="w-6"
                src={isActive ? link.icon : link.NoneActiveIcon}
                alt={link.label}
              />
              {link.label}
            </NavLink>
          );
        })}
      </div>
      <div className="">
        <button
          className="flex items-center text-sm gap-3 font-bold text-gray-500 py-4 px-3"
          onClick={handleLogout}
        >
          <img className="w-6" src={Logout} alt="" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
