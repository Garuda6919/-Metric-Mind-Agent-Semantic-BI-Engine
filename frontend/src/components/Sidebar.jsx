import { useNavigate, NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaChartLine,
  FaRobot,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">MAIN MENU</h3>

      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaChartPie className="menu-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/analytics"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaChartLine className="menu-icon" />
            <span>Analytics</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaRobot className="menu-icon" />
            <span>AI Chat</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaFileAlt className="menu-icon" />
            <span>Reports</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCog className="menu-icon" />
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>

      {/* Logout */}
      <div className="logout" onClick={handleLogout}>
        <FaSignOutAlt className="menu-icon" />
        <span>Logout</span>
      </div>
    </aside>
  );
}

export default Sidebar;