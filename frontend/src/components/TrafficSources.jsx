import "../styles/TrafficSources.css";

const sources = [
  { name: "🌐 Direct", percentage: 40 },
  { name: "🔍 Search", percentage: 30 },
  { name: "📱 Social Media", percentage: 20 },
  { name: "📧 Email", percentage: 10 },
];

function TrafficSources() {
  return (
    <div className="traffic-card">
      <h2>📈 Traffic Sources</h2>

      {sources.map((source, index) => (
        <div className="traffic-item" key={index}>
          <div className="traffic-header">
            <span>{source.name}</span>
            <span>{source.percentage}%</span>
          </div>

          <div className="traffic-bar">
            <div
              className="traffic-fill"
              style={{ width: `${source.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrafficSources;