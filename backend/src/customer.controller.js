const fs = require("fs");
const path = require("path");

// =========================
// File Paths
// =========================

const dataDir = path.join(__dirname, "../data");
const customersFile = path.join(dataDir, "customers.json");

// =========================
// Create data folder
// =========================

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// =========================
// Create customers.json
// =========================

if (!fs.existsSync(customersFile)) {
    fs.writeFileSync(customersFile, "[]", "utf8");
}

// =========================
// Helper: Read Customers
// =========================

const readCustomers = () => {
    try {
        const data = fs.readFileSync(customersFile, "utf8");

        if (!data || data.trim() === "") {
            return [];
        }

        const customers = JSON.parse(data);

        return Array.isArray(customers) ? customers : [];
    } catch (error) {
        console.error("Read Customers Error:", error);
        return [];
    }
};

// =========================
// Helper: Save Customers
// =========================

const saveCustomers = (customers) => {
    fs.writeFileSync(
        customersFile,
        JSON.stringify(customers, null, 2),
        "utf8"
    );
};

// =========================
// Customer Registration
// =========================

const registerCustomer = (req, res) => {
    try {
        console.log("REGISTER API HIT");
        console.log("REGISTER BODY:", req.body);

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Read existing customers
        const customers = readCustomers();

        // Check existing email
        const existingCustomer = customers.find(
            (customer) =>
                customer.email &&
                customer.email.toLowerCase() === cleanEmail
        );

        if (existingCustomer) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create customer
        const newCustomer = {
            id: Date.now().toString(),
            name: cleanName,
            email: cleanEmail,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Save customer
        customers.push(newCustomer);
        saveCustomers(customers);

        console.log("Customer registered:", cleanEmail);

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
            message: "Failed to register customer"
        });
    }
};

// =========================
// Customer Login
// =========================

const loginCustomer = (req, res) => {
    try {
        console.log("LOGIN API HIT");
        console.log("LOGIN BODY:", req.body);

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Read customers
        const customers = readCustomers();

        console.log("Customers found:", customers.length);

        // Find customer
        const customer = customers.find(
            (user) =>
                user.email &&
                user.email.toLowerCase() === cleanEmail &&
                user.password === password
        );

        // Invalid credentials
        if (!customer) {
            console.log("Invalid login:", cleanEmail);

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Successful login
        console.log("Login successful:", cleanEmail);

        return res.status(200).json({
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

// =========================
// Export
// =========================

module.exports = {
    registerCustomer,
    loginCustomer
};