const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const customersFile = path.join(dataDir, "customers.json");

// Create data folder
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create customers.json
if (!fs.existsSync(customersFile)) {
    fs.writeFileSync(customersFile, "[]", "utf8");
}

// Register Customer
const registerCustomer = (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        let customers = [];

        try {
            const data = fs.readFileSync(customersFile, "utf8");
            customers = JSON.parse(data || "[]");
        } catch (error) {
            customers = [];
        }

        const existingCustomer = customers.find(
            (customer) =>
                customer.email &&
                customer.email.toLowerCase() ===
                    email.trim().toLowerCase()
        );

        if (existingCustomer) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const newCustomer = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            createdAt: new Date().toISOString()
        };

        customers.push(newCustomer);

        fs.writeFileSync(
            customersFile,
            JSON.stringify(customers, null, 2),
            "utf8"
        );

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            customer: {
                id: newCustomer.id,
                name: newCustomer.name,
                email: newCustomer.email
            }
        });

    } catch (error) {
        console.error("Register Customer Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register customer",
            error: error.message
        });
    }
};
// Customer Login
const loginCustomer = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        let customers = [];

        try {
            const data = fs.readFileSync(customersFile, "utf8");
            customers = JSON.parse(data || "[]");
        } catch (error) {
            customers = [];
        }

        const customer = customers.find(
            (user) =>
                user.email &&
                user.email.toLowerCase() ===
                    email.trim().toLowerCase() &&
                user.password === password
        );

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        return res.json({
            success: true,
            message: "Login successful",
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

module.exports = {
    registerCustomer,
    loginCustomer
};