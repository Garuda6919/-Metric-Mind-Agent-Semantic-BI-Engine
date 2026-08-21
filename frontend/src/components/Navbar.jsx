import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  // Notifications Page
  const handleNotification = () => {
    navigate("/notifications");
  };

  // Profile Page
  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo">
        <span className="logo-icon">📊</span>
        <h2>Metric Mind</h2>
      </div>

      {/* Right Section */}
      <div className="nav-right">
        {/* Search */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Notification */}
        <div
          className="notification"
          onClick={handleNotification}
          title="Notifications"
        >
          <FaBell className="nav-icon" />
        </div>

        {/* Theme Toggle */}
        <div
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {darkMode ? (
            <FaSun className="nav-icon" />
          ) : (
            <FaMoon className="nav-icon" />
          )}
        </div>

        {/* Profile */}
        <div
          className="profile"
          onClick={handleProfile}
          title="My Profile"
        >
          <FaUserCircle className="profile-icon" />

          <div className="user-info">
            <h4>TEAM</h4>
            <p>Frontend Developer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;