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
  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // FETCH REPORT DATA
  // =========================================================

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        // Get production backend URL
        const API_URL = (
          import.meta.env.VITE_API_URL || ""
        ).replace(/\/+$/, "");

        console.log("REPORT API URL:", API_URL);

        if (!API_URL) {
          throw new Error(
            "VITE_API_URL is not configured."
          );
        }

        const dashboardURL = `${API_URL}/api/dashboard`;

        console.log(
          "REPORT DASHBOARD URL:",
          dashboardURL
        );

        // IMPORTANT:
        // Do NOT put fetch(...) inside the URL string.
        const response = await fetch(dashboardURL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        console.log(
          "Report response status:",
          response.status
        );

        // Read response as text first.
        // This prevents JSON parse errors when backend
        // returns empty/HTML/text response.
        const responseText = await response.text();

        console.log(
          "Report raw response:",
          responseText
        );

        let result = {};

        if (responseText.trim()) {
          try {
            result = JSON.parse(responseText);
          } catch (jsonError) {
            console.error(
              "Report JSON Parse Error:",
              jsonError
            );

            throw new Error(
              `Backend returned invalid JSON: ${responseText.substring(
                0,
                300
              )}`
            );
          }
        }

        // Handle HTTP errors
        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.error ||
              `Request failed with status ${response.status}`
          );
        }

        // Backend must return:
        // {
        //   success: true,
        //   data: {...}
        // }

        if (!result.success) {
          throw new Error(
            result?.message ||
              "Backend returned unsuccessful response"
          );
        }

        if (!result.data) {
          throw new Error(
            "Dashboard data is missing from backend response"
          );
        }

        console.log(
          "REPORT DATA:",
          result.data
        );

        // IMPORTANT:
        // Correct state setter
        setDashboardData({
          customers: Number(
            result.data.customers || 0
          ),

          revenue: Number(
            result.data.revenue || 0
          ),

          orders: Number(
            result.data.orders || 0
          ),

          products: Number(
            result.data.products || 0
          ),

          monthlySales:
            Array.isArray(
              result.data.monthlySales
            )
              ? result.data.monthlySales
              : [],

          salesByCategory:
            Array.isArray(
              result.data.salesByCategory
            )
              ? result.data.salesByCategory
              : [],

          recentOrders:
            Array.isArray(
              result.data.recentOrders
            )
              ? result.data.recentOrders
              : [],

          recentCustomers:
            Array.isArray(
              result.data.recentCustomers
            )
              ? result.data.recentCustomers
              : [],
        });
      } catch (error) {
        console.error(
          "Reports API Error:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Failed to load report data"
        );

        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // =========================================================
  // PDF REPORT
  // =========================================================

  const downloadPDF = () => {
    if (!dashboardData) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Business Sales Report",
      14,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Customers: ${Number(
        dashboardData.customers || 0
      ).toLocaleString("en-IN")}`,
      14,
      30
    );

    doc.text(
      `Orders: ${Number(
        dashboardData.orders || 0
      ).toLocaleString("en-IN")}`,
      14,
      37
    );

    doc.text(
      `Products: ${Number(
        dashboardData.products || 0
      ).toLocaleString("en-IN")}`,
      14,
      44
    );

    doc.text(
      `Revenue: ₹${Number(
        dashboardData.revenue || 0
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      14,
      51
    );

    const monthlySales =
      dashboardData.monthlySales || [];

    autoTable(doc, {
      startY: 60,

      head: [["Month", "Sales"]],

      body: monthlySales.map((item) => [
        item?.month || "-",

        `₹${Number(
          item?.sales || 0
        ).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}`,
      ]),
    });

    doc.save(
      "Business_Sales_Report.pdf"
    );
  };

  // =========================================================
  // EXCEL REPORT
  // =========================================================

  const exportExcel = () => {
    if (!dashboardData) {
      return;
    }

    const summaryData = [
      ["Metric", "Value"],

      [
        "Customers",
        Number(
          dashboardData.customers || 0
        ),
      ],

      [
        "Orders",
        Number(
          dashboardData.orders || 0
        ),
      ],

      [
        "Products",
        Number(
          dashboardData.products || 0
        ),
      ],

      [
        "Revenue",
        Number(
          dashboardData.revenue || 0
        ),
      ],
    ];

    const monthlySalesData = [
      ["Month", "Sales"],

      ...(dashboardData.monthlySales || []).map(
        (item) => [
          item?.month || "-",
          Number(item?.sales || 0),
        ]
      ),
    ];

    const categoryData = [
      ["Category", "Sales"],

      ...(dashboardData.salesByCategory || []).map(
        (item) => [
          item?.name || "-",
          Number(item?.value || 0),
        ]
      ),
    ];

    const workbook =
      XLSX.utils.book_new();

    // Summary sheet
    const summarySheet =
      XLSX.utils.aoa_to_sheet(
        summaryData
      );

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary"
    );

    // Monthly sales sheet
    const monthlySheet =
      XLSX.utils.aoa_to_sheet(
        monthlySalesData
      );

    XLSX.utils.book_append_sheet(
      workbook,
      monthlySheet,
      "Monthly Sales"
    );

    // Category sales sheet
    const categorySheet =
      XLSX.utils.aoa_to_sheet(
        categoryData
      );

    XLSX.utils.book_append_sheet(
      workbook,
      categorySheet,
      "Sales by Category"
    );

    // Generate Excel file
    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const file = new Blob(
      [excelBuffer],
      {
        type: "application/octet-stream",
      }
    );

    saveAs(
      file,
      "Business_Report.xlsx"
    );
  };

  // =========================================================
  // CUSTOMER REPORT
  // =========================================================

  const viewCustomerReport = () => {
    navigate("/customer-report");
  };

  // =========================================================
  // LOADING
  // =========================================================

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

                <p>
                  Loading real business data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

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

                <p>
                  Failed to load report data.
                </p>

                {errorMessage && (
                  <p
                    style={{
                      color: "red",
                      marginTop: "10px",
                    }}
                  >
                    {errorMessage}
                  </p>
                )}

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  style={{
                    marginTop: "15px",
                    padding:
                      "10px 20px",
                    cursor: "pointer",
                  }}
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN REPORT PAGE
  // =========================================================

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
                Reports generated from your
                actual business data.
              </p>
            </div>

            {/* Report Cards */}

            <div className="report-cards">

              {/* Sales Report */}

              <div className="report-card">
                <h2>
                  Sales Report
                </h2>

                <p>
                  Total orders:{" "}
                  <strong>
                    {Number(
                      dashboardData.orders ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </p>

                <p>
                  Monthly sales data
                  available
                </p>

                <button
                  onClick={
                    downloadPDF
                  }
                >
                  📥 Download PDF
                </button>
              </div>

              {/* Revenue Report */}

              <div className="report-card">
                <h2>
                  Revenue Report
                </h2>

                <p>
                  Total Revenue:
                </p>

                <h3>
                  ₹
                  {Number(
                    dashboardData.revenue ||
                      0
                  ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </h3>

                <button
                  onClick={
                    exportExcel
                  }
                >
                  📊 Export Excel
                </button>
              </div>

              {/* Customer Report */}

              <div className="report-card">
                <h2>
                  Customer Report
                </h2>

                <p>
                  Total Customers:
                </p>

                <h3>
                  {Number(
                    dashboardData.customers ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h3>

                <button
                  onClick={
                    viewCustomerReport
                  }
                >
                  👁 View Report
                </button>
              </div>
            </div>

            {/* Real Data Summary */}

            <div className="recent-reports">
              <h2>
                Report Data Summary
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>
                      Report
                    </th>

                    <th>
                      Actual Data
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {/* Sales */}

                  <tr>
                    <td>
                      Sales Report
                    </td>

                    <td>
                      {Number(
                        dashboardData.orders ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      Orders
                    </td>

                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                  {/* Revenue */}

                  <tr>
                    <td>
                      Revenue Report
                    </td>

                    <td>
                      ₹
                      {Number(
                        dashboardData.revenue ||
                          0
                      ).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                  {/* Customers */}

                  <tr>
                    <td>
                      Customer Report
                    </td>

                    <td>
                      {Number(
                        dashboardData.customers ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      Customers
                    </td>

                    <td>
                      <span className="status-completed">
                        ✅ Available
                      </span>
                    </td>
                  </tr>

                  {/* Products */}

                  <tr>
                    <td>
                      Product Report
                    </td>

                    <td>
                      {Number(
                        dashboardData.products ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      Products
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