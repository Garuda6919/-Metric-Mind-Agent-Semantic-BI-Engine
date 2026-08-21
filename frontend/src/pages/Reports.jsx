import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Reports.css";
import { useNavigate } from "react-router-dom";

function Reports() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load real data from backend
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Failed to load report data");
        }

        setDashboardData(result.data);

        console.log("REPORT DATA:", result.data);
      } catch (error) {
        console.error("Reports API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // -----------------------------
  // PDF REPORT
  // -----------------------------
  const downloadPDF = () => {
    if (!dashboardData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Business Sales Report", 14, 20);

    doc.setFontSize(11);
    doc.text(
      `Customers: ${dashboardData.customers.toLocaleString("en-IN")}`,
      14,
      30
    );

    doc.text(
      `Orders: ${dashboardData.orders.toLocaleString("en-IN")}`,
      14,
      37
    );

    doc.text(
      `Products: ${dashboardData.products.toLocaleString("en-IN")}`,
      14,
      44
    );

    doc.text(
      `Revenue: ₹${Number(dashboardData.revenue).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      14,
      51
    );

    const monthlySales = dashboardData.monthlySales || [];

    autoTable(doc, {
      startY: 60,
      head: [["Month", "Sales"]],
      body: monthlySales.map((item) => [
        item.month,
        `₹${Number(item.sales).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}`,
      ]),
    });

    doc.save("Business_Sales_Report.pdf");
  };

  // -----------------------------
  // EXCEL REPORT
  // -----------------------------
  const exportExcel = () => {
    if (!dashboardData) return;

    const summaryData = [
      ["Metric", "Value"],
      [
        "Customers",
        dashboardData.customers,
      ],
      [
        "Orders",
        dashboardData.orders,
      ],
      [
        "Products",
        dashboardData.products,
      ],
      [
        "Revenue",
        dashboardData.revenue,
      ],
    ];

    const monthlySalesData = [
      ["Month", "Sales"],
      ...(dashboardData.monthlySales || []).map((item) => [
        item.month,
        item.sales,
      ]),
    ];

    const categoryData = [
      ["Category", "Sales"],
      ...(dashboardData.salesByCategory || []).map((item) => [
        item.name,
        item.value,
      ]),
    ];

    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary"
    );

    // Monthly sales sheet
    const monthlySheet = XLSX.utils.aoa_to_sheet(
      monthlySalesData
    );
    XLSX.utils.book_append_sheet(
      workbook,
      monthlySheet,
      "Monthly Sales"
    );

    // Category sales sheet
    const categorySheet = XLSX.utils.aoa_to_sheet(
      categoryData
    );
    XLSX.utils.book_append_sheet(
      workbook,
      categorySheet,
      "Sales by Category"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "Business_Report.xlsx");
  };

  const viewCustomerReport = () => {
    navigate("/customer-report");
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />

        <div className="main-content">
          <Sidebar />

          <div className="content">
            <div className="reports-container">
              <div className="reports-header">
                <h1>📄 Reports</h1>
                <p>Loading real business data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------
  if (!dashboardData) {
    return (
      <div className="dashboard">
        <Navbar />

        <div className="main-content">
          <Sidebar />

          <div className="content">
            <div className="reports-container">
              <div className="reports-header">
                <h1>📄 Reports</h1>
                <p>Failed to load report data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <div className="reports-container">

            {/* Header */}
            <div className="reports-header">
              <h1>📄 Reports</h1>
              <p>
                Reports generated from your actual business data.
              </p>
            </div>

            {/* Report Cards */}
            <div className="report-cards">

              {/* Sales Report */}
              <div className="report-card">
                <h2>Sales Report</h2>

                <p>
                  Total orders:{" "}
                  <strong>
                    {dashboardData.orders.toLocaleString("en-IN")}
                  </strong>
                </p>

                <p>
                  Monthly sales data available
                </p>

                <button onClick={downloadPDF}>
                  📥 Download PDF
                </button>
              </div>

              {/* Revenue Report */}
              <div className="report-card">
                <h2>Revenue Report</h2>

                <p>
                  Total Revenue:
                </p>

                <h3>
                  ₹
                  {Number(
                    dashboardData.revenue
                  ).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </h3>

                <button onClick={exportExcel}>
                  📊 Export Excel
                </button>
              </div>

              {/* Customer Report */}
              <div className="report-card">
                <h2>Customer Report</h2>

                <p>
                  Total Customers:
                </p>

                <h3>
                  {dashboardData.customers.toLocaleString("en-IN")}
                </h3>

                <button onClick={viewCustomerReport}>
                  👁 View Report
                </button>
              </div>

            </div>

            {/* Real Data Summary */}
            <div className="recent-reports">
              <h2>Report Data Summary</h2>

              <table>
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Actual Data</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>Sales Report</td>
                    <td>
                      {dashboardData.orders.toLocaleString("en-IN")} Orders
                    </td>
                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Revenue Report</td>
                    <td>
                      ₹
                      {Number(
                        dashboardData.revenue
                      ).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Customer Report</td>
                    <td>
                      {dashboardData.customers.toLocaleString("en-IN")} Customers
                    </td>
                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Product Report</td>
                    <td>
                      {dashboardData.products.toLocaleString("en-IN")} Products
                    </td>
                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;