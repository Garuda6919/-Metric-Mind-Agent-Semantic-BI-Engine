import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import RecentOrders from "../components/RecentOrders";
import RecentCustomers from "../components/RecentCustomers";

import "../styles/Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    customers: 0,
    revenue: 0,
    orders: 0,
    products: 0,
    monthlySales: [],
    salesByCategory: [],
    recentOrders: [],
    recentCustomers: [],
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Failed to load dashboard data");
        }

        console.log("DASHBOARD DATA:", result.data);
        console.log("RECENT ORDERS:", result.data.recentOrders);
        setDashboardData(result.data);
      } catch (error) {
        console.error("Dashboard API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">

          {/* Welcome Section */}
          <div className="dashboard-header">
            <h1>Welcome back, sekhar reddy</h1>
            <p>
              Here's what's happening with your business today.
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="cards">

            <DashboardCard
              title="Revenue"
              value={
                loading
                  ? "Loading..."
                  : `₹${dashboardData.revenue.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}`
              }
            />

            <DashboardCard
              title="Orders"
              value={
                loading
                  ? "Loading..."
                  : dashboardData.orders.toLocaleString("en-IN")
              }
            />

            <DashboardCard
              title="Customers"
              value={
                loading
                  ? "Loading..."
                  : dashboardData.customers.toLocaleString("en-IN")
              }
            />

            <DashboardCard
              title="Products"
              value={
                loading
                  ? "Loading..."
                  : dashboardData.products.toLocaleString("en-IN")
              }
            />

          </div>

          {/* Charts Section */}
          <div className="charts-section">

            <div className="chart-box">
              <Chart
                data={dashboardData.monthlySales}
              />
            </div>

            <div className="pie-box">
              <PieChart
                data={dashboardData.salesByCategory}
              />
            </div>

          </div>

          {/* Bottom Section */}
          <div className="bottom-section">

            <div className="orders-box">
              <RecentOrders
                data={dashboardData.recentOrders || []}
              />
            </div>

            <div className="customers-box">
              <RecentCustomers
    data={dashboardData.recentCustomers || []}
/>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;