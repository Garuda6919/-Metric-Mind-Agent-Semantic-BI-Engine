const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// ==========================================
// RAW DATA PATH
// ==========================================

const DATA_PATH = path.join(
    __dirname,
    "../../../datasets/raw"
);

// ==========================================
// CSV LOADER
// ==========================================

const csvCache = new Map();

const loadCSV = (fileName) => {
    // Already loaded → return from memory
    if (csvCache.has(fileName)) {
        return csvCache.get(fileName);
    }

    const filePath = path.join(DATA_PATH, fileName);

    if (!fs.existsSync(filePath)) {
        console.error("CSV NOT FOUND:", filePath);
        return [];
    }

    try {
        const file = fs.readFileSync(filePath, "utf8");

        const data = parse(file, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });

        // Store parsed CSV in memory
        csvCache.set(fileName, data);

        console.log(`Loaded CSV: ${fileName}`);

        return data;
    } catch (error) {
        console.error(`Error loading ${fileName}:`, error.message);
        return [];
    }
};

// ==========================================
// RAW DATA LOADERS
// ==========================================

const getPayments = () => {
    return loadCSV("olist_order_payments_dataset.csv");
};

const getOrders = () => {
    return loadCSV("olist_orders_dataset.csv");
};

const getCustomers = () => {
    return loadCSV("olist_customers_dataset.csv");
};

const getOrderItems = () => {
    return loadCSV("olist_order_items_dataset.csv");
};

const getProducts = () => {
    return loadCSV("olist_products_dataset.csv");
};

const getCategoryTranslation = () => {
    return loadCSV("product_category_name_translation.csv");
};

// ==========================================
// CUSTOMER COUNT
// ==========================================

const getCustomerCount = async () => {
    const customers = getCustomers();

    return customers.length;
};

// ==========================================
// TOTAL SALES REVENUE
// ==========================================

const getTotalSalesRevenue = async () => {
    const payments = getPayments();

    return payments.reduce((total, payment) => {
        const value = Number(payment.payment_value);

        return total + (isNaN(value) ? 0 : value);
    }, 0);
};

// ==========================================
// ORDER COUNT
// ==========================================

const getOrderCount = async () => {
    const orders = getOrders();

    return orders.filter(
        (order) =>
            order.order_status !== "canceled" &&
            order.order_status !== "unavailable"
    ).length;
};

// ==========================================
// PRODUCT COUNT
// ==========================================

const getProductCount = async () => {
    const items = getOrderItems();

    const productIds = new Set();

    items.forEach((item) => {
        if (item.product_id) {
            productIds.add(item.product_id);
        }
    });

    return productIds.size;
};

// ==========================================
// MONTHLY SALES
// ==========================================

const getMonthlySales = async () => {
    const orders = getOrders();
    const payments = getPayments();

    const paymentByOrder = {};

    payments.forEach((payment) => {
        const orderId = payment.order_id;
        const value = Number(payment.payment_value) || 0;

        paymentByOrder[orderId] =
            (paymentByOrder[orderId] || 0) + value;
    });

    const monthlySales = {};

    orders.forEach((order) => {
        if (
            order.order_status === "canceled" ||
            order.order_status === "unavailable"
        ) {
            return;
        }

        const date = order.order_purchase_timestamp;

        if (!date) {
            return;
        }

        const month = date.substring(0, 7);

        monthlySales[month] =
            (monthlySales[month] || 0) +
            (paymentByOrder[order.order_id] || 0);
    });

    return Object.keys(monthlySales)
        .sort()
        .map((month) => ({
            month,
            sales: Number(
                monthlySales[month].toFixed(2)
            ),
        }));
};

// ==========================================
// SALES BY CATEGORY
// ==========================================

const getSalesByCategory = async () => {
    const items = getOrderItems();
    const products = getProducts();
    const translations = getCategoryTranslation();

    const productCategory = {};
    const translatedCategory = {};

    translations.forEach((item) => {
        translatedCategory[
            item.product_category_name
        ] = item.product_category_name_english;
    });

    products.forEach((product) => {
        const category = product.product_category_name;

        productCategory[product.product_id] =
            translatedCategory[category] ||
            category ||
            "Unknown";
    });

    const categorySales = {};

    items.forEach((item) => {
        const category =
            productCategory[item.product_id] ||
            "Unknown";

        const price = Number(item.price) || 0;

        categorySales[category] =
            (categorySales[category] || 0) + price;
    });

    // IMPORTANT:
    // Frontend PieChart expects name + value

    return Object.keys(categorySales)
        .map((category) => ({
            name: category,
            value: Number(
                categorySales[category].toFixed(2)
            ),
        }))
        .sort((a, b) => b.value - a.value);
};

// ==========================================
// RECENT ORDERS
// ==========================================

const getRecentOrders = async () => {
    const orders = getOrders();
    const payments = getPayments();

    const paymentByOrder = {};

    payments.forEach((payment) => {
        const value =
            Number(payment.payment_value) || 0;

        paymentByOrder[payment.order_id] =
            (paymentByOrder[payment.order_id] || 0) +
            value;
    });

    return orders
        .filter(
            (order) =>
                order.order_purchase_timestamp
        )
        .sort(
            (a, b) =>
                new Date(
                    b.order_purchase_timestamp
                ) -
                new Date(
                    a.order_purchase_timestamp
                )
        )
        .slice(0, 10)
        .map((order) => ({
            // Frontend expects these names
            id: order.order_id,

            customer: order.customer_id,

            status: order.order_status,

            amount: Number(
                (
                    paymentByOrder[
                        order.order_id
                    ] || 0
                ).toFixed(2)
            ),

            date: order.order_purchase_timestamp,
        }));
};
// ==========================================
// RECENT CUSTOMERS
// ==========================================

const getRecentCustomers = async () => {
    const customers = getCustomers();

    return customers
        .slice(-5)
        .reverse()
        .map((customer) => ({
            name: customer.customer_id || "Unknown",
            city: customer.customer_city || "Unknown",
            state: customer.customer_state || "",
        }));
};


// ==========================================
// TOP 5 PRODUCTS BY SALES
// ==========================================

const getTopProductsBySales = async () => {
    const items = getOrderItems();
    const products = getProducts();
    const translations = getCategoryTranslation();

    const translatedCategory = {};

    translations.forEach((item) => {
        translatedCategory[
            item.product_category_name
        ] = item.product_category_name_english;
    });

    const productCategory = {};

    products.forEach((product) => {
        productCategory[product.product_id] =
            translatedCategory[
                product.product_category_name
            ] ||
            product.product_category_name ||
            "Unknown";
    });

    const productSales = {};

    items.forEach((item) => {
        const productId = item.product_id;

        if (!productId) {
            return;
        }

        const price = Number(item.price) || 0;

        if (!productSales[productId]) {
            productSales[productId] = {
                productId,
                category:
                    productCategory[productId] ||
                    "Unknown",
                totalSales: 0,
            };
        }

        productSales[productId].totalSales += price;
    });

    return Object.values(productSales)
        .sort(
            (a, b) =>
                b.totalSales - a.totalSales
        )
        .slice(0, 5)
        .map((product) => ({
            ...product,
            totalSales: Number(
                product.totalSales.toFixed(2)
            ),
        }));
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    getPayments,
    getOrders,
    getCustomers,
    getOrderItems,
    getProducts,
    getCategoryTranslation,

    getCustomerCount,
    getTotalSalesRevenue,
    getOrderCount,
    getProductCount,
    getMonthlySales,
    getSalesByCategory,
    getRecentOrders,
    getRecentCustomers,
    getTopProductsBySales,
};