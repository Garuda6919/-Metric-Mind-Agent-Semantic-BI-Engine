import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Settings.css";

function Settings() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">

          <div className="settings-container">

            <div className="settings-header">
              <h1>⚙️ Settings</h1>
              <p>Manage your account and application preferences.</p>
            </div>

            {/* Profile */}
            <div className="settings-card">
              <h2>Profile Information</h2>

              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="sekharreddy" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  defaultValue="sekharreddy@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  defaultValue="+91 9876543210"
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  defaultValue="MetricMind Pvt Ltd"
                />
              </div>
            </div>

            {/* Security */}
            <div className="settings-card">
              <h2>Security</h2>

              <div className="setting-row">
                <span>Two-Factor Authentication</span>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-row">
                <span>Email Login Alerts</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>

            {/* Appearance */}
            <div className="settings-card">
              <h2>Appearance</h2>

              <div className="setting-row">
                <span>Dark Mode</span>
                <input type="checkbox" />
              </div>

             
            </div>

            {/* Notifications */}
            <div className="settings-card">
              <h2>Notifications</h2>

              <div className="setting-row">
                <span>Email Notifications</span>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-row">
                <span>SMS Notifications</span>
                <input type="checkbox" />
              </div>

              <div className="setting-row">
                <span>Push Notifications</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>

            <button className="save-btn">
              💾 Save Changes
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;