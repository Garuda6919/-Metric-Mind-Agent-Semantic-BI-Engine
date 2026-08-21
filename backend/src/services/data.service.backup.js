const fs = require("fs");
const path = require("path");

const customersFile = path.join(
    __dirname,
    "../../data/customers.json"
);

// Read customers
function getCustomers() {
    try {
        if (!fs.existsSync(customersFile)) {
            return [];
        }

        const data = fs.readFileSync(customersFile, "utf8");

        return JSON.parse(data || "[]");
    } catch (error) {
        console.error("Customers Read Error:", error);
        return [];
    }
}

// ==============================
// Customers
// ==============================

async function getCustomerCount() {
    const customers = getCustomers();
    return customers.length;
}

// ==============================
// Business data
// Currently no orders/products/sales
// data files are available.
// ==============================

async function getTotalSalesRevenue() {
    return 0;
}

async function getOrderCount() {
    return 0;
}

async function getProductCount() {
    return 0;
}

async function getMonthlySales() {
    return [];
}

async function getSalesByCategory() {
    return [];
}

async function getRecentOrders() {
    return [];
}

module.exports = {
    getCustomerCount,
    getTotalSalesRevenue,
    getOrderCount,
    getProductCount,
    getMonthlySales,
    getSalesByCategory,
    getRecentOrders,
};