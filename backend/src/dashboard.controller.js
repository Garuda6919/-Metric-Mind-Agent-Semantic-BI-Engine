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
        const [
            customers,
            revenue,
            orders,
            products,
            monthlySales,
            salesByCategory,
            recentOrders,
        ] = await Promise.all([
            getCustomerCount(),
            getTotalSalesRevenue(),
            getOrderCount(),
            getProductCount(),
            getMonthlySales(),
            getSalesByCategory(),
            getRecentOrders(),
        ]);

        res.json({
            success: true,
            data: {
                customers,
                revenue,
                orders,
                products,
                monthlySales,
                salesByCategory,
                recentOrders,
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