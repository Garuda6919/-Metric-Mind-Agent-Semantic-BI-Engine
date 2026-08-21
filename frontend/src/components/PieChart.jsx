import { useMemo } from "react";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
];

function SalesPieChart({ data = [] }) {

  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Support backend data
    // { name, value }
    // and old format
    // { category, sales }

    const formatted = data
      .map((item) => ({
        name: item.name ?? item.category ?? "Unknown",
        value: Number(item.value ?? item.sales ?? 0),
      }))
      .filter((item) => item.value > 0);

    const sortedData = [...formatted].sort(
      (a, b) => b.value - a.value
    );

    const topFive = sortedData.slice(0, 5);

    const otherValue = sortedData
      .slice(5)
      .reduce((sum, item) => sum + item.value, 0);

    if (otherValue > 0) {
      topFive.push({
        name: "Others",
        value: Number(otherValue.toFixed(2)),
      });
    }

    return topFive;
  }, [data]);

  const totalSales = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        height: "420px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#111827",
          fontWeight: "700",
          fontSize: "28px",
        }}
      >
        Sales by Category
      </h2>

      {chartData.length === 0 ? (
        <div
          style={{
            height: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          No sales data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              labelLine={false}
              label={({ percent }) =>
                `${Math.round(percent * 100)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const percentage =
                  totalSales > 0
                    ? ((Number(value) / totalSales) * 100).toFixed(2)
                    : "0.00";

                return [
                  `₹${Number(value).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })} (${percentage}%)`,
                  name,
                ];
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SalesPieChart;