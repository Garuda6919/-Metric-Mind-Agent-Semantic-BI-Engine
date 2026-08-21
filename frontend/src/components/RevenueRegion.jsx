import "../styles/RevenueRegion.css";

const regions = [
  { name: "South India", revenue: "₹22,500", percentage: 80 },
  { name: "North India", revenue: "₹14,000", percentage: 60 },
  { name: "East India", revenue: "₹7,500", percentage: 40 },
  { name: "West India", revenue: "₹4,500", percentage: 25 },
];

function RevenueRegion() {
  return (
    <div className="region-card">
      <h2>🌍 Revenue by Region</h2>

      {regions.map((region, index) => (
        <div className="region-item" key={index}>
          <div className="region-header">
            <span>{region.name}</span>
            <span>{region.revenue}</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${region.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RevenueRegion;