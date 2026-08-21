const {
    getCustomerCount,
    getTotalSalesRevenue,
    getOrderCount,
    getProductCount,
    getMonthlySales,
    getSalesByCategory,
    getRecentOrders,
} = require("../services/data.service");

const getDashboardData = async (req, res) => {
    try {
        const customers = await getCustomerCount();
        const revenue = await getTotalSalesRevenue();
        const orders = await getOrderCount();
        const products = await getProductCount();
        const monthlySales = await getMonthlySales();
        const salesByCategory = await getSalesByCategory();
        const recentOrders = await getRecentOrders();

        console.log("DASHBOARD RECENT ORDERS:", recentOrders);

        res.json({
            success: true,
            data: {
                customers,
                revenue,
                orders,
                products,
                monthlySales,
                salesByCategory,
                recentOrders: recentOrders || [],
            },
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard data",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardData,
};