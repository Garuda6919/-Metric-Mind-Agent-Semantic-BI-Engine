import "../styles/AIInsights.css";

function AIInsights() {
  const insights = [
    "📈 Revenue increased by 24% compared to last month.",
    "🏆 Electronics is the best-selling category.",
    "📍 South India generated the highest revenue.",
    "👥 Customer retention improved by 12%.",
  ];

  return (
    <div className="insights-card">
      <h2>🤖 AI Insights</h2>

      <ul className="insights-list">
        {insights.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default AIInsights;