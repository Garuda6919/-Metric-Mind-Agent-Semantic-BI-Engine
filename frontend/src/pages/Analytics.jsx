import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import AIInsights from "../components/AIInsights";

import "../styles/Dashboard.css";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Failed to load analytics data");
        }

        console.log("ANALYTICS DATA:", result.data);

        setAnalyticsData(result.data);
      } catch (error) {
        console.error("Analytics API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // ==========================================
  // BEST SELLING CATEGORY
  // Backend format:
  // { category, sales }
  // ==========================================

  const bestSellingCategory =
    analyticsData?.salesByCategory?.length > 0
      ? [...analyticsData.salesByCategory].sort(
          (a, b) => Number(b.sales) - Number(a.sales)
        )[0]
      : null;

  // ==========================================
  // GROWTH CALCULATION
  // ==========================================

  const monthlySales = analyticsData?.monthlySales || [];

  let growth = 0;

  if (monthlySales.length >= 2) {
    const previous =
      Number(
        monthlySales[monthlySales.length - 2].sales
      ) || 0;

    const current =
      Number(
        monthlySales[monthlySales.length - 1].sales
      ) || 0;

    if (previous > 0) {
      growth = ((current - previous) / previous) * 100;
    }
  }

  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">

          {/* Header */}

          <div className="dashboard-header">
            <h1>Analytics 📊</h1>

            <p>
              Monitor your business performance and sales analytics.
            </p>
          </div>

          {/* =================================================
              ANALYTICS CARDS
          ================================================= */}

          {loading ? (
            <div
              style={{
                padding: "30px",
                fontSize: "20px",
              }}
            >
              Loading analytics data...
            </div>
          ) : analyticsData ? (
            <>
              <div className="cards">

                {/* Revenue */}

                <DashboardCard
                  title="Revenue"
                  value={`₹${Number(
                    analyticsData.revenue || 0
                  ).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}`}
                />

                {/* Orders */}

                <DashboardCard
                  title="Orders"
                  value={Number(
                    analyticsData.orders || 0
                  ).toLocaleString("en-IN")}
                />

                {/* Customers */}

                <DashboardCard
                  title="Customers"
                  value={Number(
                    analyticsData.customers || 0
                  ).toLocaleString("en-IN")}
                />

                {/* Growth */}

                <DashboardCard
                  title="Growth"
                  value={`${
                    growth >= 0 ? "+" : ""
                  }${growth.toFixed(2)}%`}
                />

              </div>

              {/* =================================================
                  RAW DATA CHARTS
              ================================================= */}

              <div className="charts-section">

                {/* Monthly Sales */}

                <div className="chart-box">
                  <Chart
                    data={
                      analyticsData.monthlySales || []
                    }
                  />
                </div>

                {/* Sales by Category */}

                <div className="pie-box">
                  <PieChart
                    data={
                      analyticsData.salesByCategory || []
                    }
                  />
                </div>

              </div>

              {/* =================================================
                  ANALYTICS SUMMARY
              ================================================= */}

              <div className="analytics-summary">

                {/* Best Selling Category */}

                <div className="summary-card">

                  <h3>Best Selling Category</h3>

                  {bestSellingCategory ? (
                    <>
                      <p>
                        {bestSellingCategory.category}
                      </p>

                      <small>
                        Sales: ₹
                        {Number(
                          bestSellingCategory.sales || 0
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </small>
                    </>
                  ) : (
                    <p>No data available</p>
                  )}

                </div>

                {/* Total Revenue */}

                <div className="summary-card">

                  <h3>Total Revenue</h3>

                  <p>
                    ₹
                    {Number(
                      analyticsData.revenue || 0
                    ).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </p>

                </div>

                {/* Total Orders */}

                <div className="summary-card">

                  <h3>Total Orders</h3>

                  <p>
                    {Number(
                      analyticsData.orders || 0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

                {/* AI Insights */}

                <div className="summary-card">

                  <h3>AI Insights</h3>

                  <AIInsights />

                </div>

              </div>
            </>
          ) : (
            <div
              style={{
                padding: "30px",
              }}
            >
              Failed to load analytics data.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Analytics;