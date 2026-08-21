import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Profile.css";

function Profile() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <div className="profile-container">

            <div className="profile-header">
              <h1>👤 My Profile</h1>
              <p>Manage your personal information.</p>
            </div>

            <div className="profile-card">

              <div className="profile-top">
                <FaUserCircle className="profile-avatar" />
                <h2>sekharreddy</h2>
                <p>Frontend Developer</p>
              </div>

              <div className="profile-form">

                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="sekharreddy" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    defaultValue="sekharreddy@example.com"
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
                  <label>Role</label>
                  <input
                    type="text"
                    defaultValue="Frontend Developer"
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    defaultValue="MetricMind"
                  />
                </div>

                <button className="save-btn">
                  Save Changes
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;