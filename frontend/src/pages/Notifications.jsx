import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Notifications.css";

function Notifications() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <div className="notifications-container">

            <div className="notifications-header">
              <h1>🔔 Notifications</h1>
              <p>Stay updated with your latest business activities.</p>
            </div>

            <div className="notification-card success">
              ✅ New order received from Rahul.
            </div>

            <div className="notification-card info">
              📊 Monthly sales report generated successfully.
            </div>

            <div className="notification-card warning">
              ⏳ Customer payment is pending.
            </div>

            <div className="notification-card danger">
              ⚠ Low stock alert for Electronics.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;