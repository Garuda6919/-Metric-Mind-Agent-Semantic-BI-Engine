const express = require("express");

const {
    registerCustomer,
    loginCustomer,
} = require("../customer.controller");

const validateChatRequest = require("../middleware/validateChatRequest");
const { handleChat } = require("../controllers/chat.controller");

const {
    getCustomerCount,
    getTotalSalesRevenue,
    getOrderCount,
    getProductCount,
    getMonthlySales,
    getSalesByCategory,
    getRecentOrders,
    getRecentCustomers,
} = require("../services/data.service");

const router = express.Router();

// =========================
// Home
// =========================
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "MetricMind Backend Running 🚀",
    });
});

// =========================
// Health
// =========================
router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Backend is healthy",
    });
});

// =========================
// Customer Registration
// =========================
router.post("/register", registerCustomer);

// =========================
// Customer Login
// =========================
router.post("/login", loginCustomer);

// =========================
// Dashboard
// =========================
// =========================
// Dashboard Cache
// =========================

let dashboardCache = null;
let dashboardPromise = null;

router.get("/dashboard", async (req, res) => {
    try {
        // If dashboard data is already calculated,
        // return it immediately.
        if (dashboardCache) {
            return res.json(dashboardCache);
        }

        // If another request is already calculating the dashboard,
        // wait for the same calculation instead of starting another one.
        if (!dashboardPromise) {
            console.log("Calculating dashboard data...");

            dashboardPromise = Promise.all([
                getCustomerCount(),
                getTotalSalesRevenue(),
                getOrderCount(),
                getProductCount(),
                getMonthlySales(),
                getSalesByCategory(),
                getRecentOrders(),
                getRecentCustomers(),
            ])
                .then(([
                    customers,
                    revenue,
                    orders,
                    products,
                    monthlySales,
                    salesByCategory,
                    recentOrders,
                    recentCustomers,
                ]) => {
                    const response = {
                        success: true,
                        data: {
                            customers,
                            revenue,
                            orders,
                            products,
                            monthlySales,
                            salesByCategory,
                            recentOrders,
                            recentCustomers,
                        },
                    };

                    dashboardCache = response;

                    console.log("Dashboard data cached successfully.");

                    return response;
                })
                .finally(() => {
                    dashboardPromise = null;
                });
        }

        const result = await dashboardPromise;

        res.json(result);

    } catch (error) {
        console.error("Dashboard API Error:", error);

        dashboardPromise = null;

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard data",
            error: error.message,
        });
    }
});

// =========================
// AI Chat
// =========================
router.post(
    "/chat",
    validateChatRequest,
    handleChat
);

module.exports = router;