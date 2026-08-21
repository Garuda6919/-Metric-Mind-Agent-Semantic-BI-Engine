import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";

import "../styles/DashboardCard.css";

function DashboardCard({ title, value }) {
  let icon;

  switch (title) {
    case "Revenue":
      icon = <IndianRupee size={28} />;
      break;

    case "Orders":
      icon = <ShoppingCart size={28} />;
      break;

    case "Customers":
      icon = <Users size={28} />;
      break;

    case "Growth":
      icon = <TrendingUp size={28} />;
      break;

    default:
      icon = <TrendingUp size={28} />;
  }

  return (
    <div className="dashboard-card">
      <div className="card-top">
        <div className="card-icon">{icon}</div>

        <span className="growth">+12%</span>
      </div>

      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default DashboardCard;