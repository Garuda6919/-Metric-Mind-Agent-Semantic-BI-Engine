const { getAIResponse } = require("./ai.service");

const {
    getCustomerCount,
    getTopProductsBySales,
    getTotalSalesRevenue,
} = require("./data.service");

// ==========================================
// PROCESS AI CHAT QUESTION
// ==========================================

const processQuestion = async (question) => {
    // Validate question
    if (!question || typeof question !== "string") {
        return {
            success: false,
            message: "Question is required",
        };
    }

    const lowerQuestion = question.toLowerCase().trim();

    // ==========================================
    // CUSTOMER COUNT
    // ==========================================

    if (
        lowerQuestion.includes("how many customers") ||
        lowerQuestion.includes("customer count") ||
        lowerQuestion.includes("number of customers")
    ) {
        const count = await getCustomerCount();

        return {
            success: true,
            data: {
                receivedQuestion: question,
                aiResponse: `There are ${count} customers in the dataset.`,
            },
        };
    }

    // ==========================================
    // TOTAL SALES REVENUE
    // ==========================================

    if (
        lowerQuestion.includes("total sales revenue") ||
        lowerQuestion.includes("total revenue") ||
        lowerQuestion.includes("total sales")
    ) {
        const totalRevenue = await getTotalSalesRevenue();

        return {
            success: true,
            data: {
                receivedQuestion: question,
                aiResponse: `The total sales revenue is ₹${Number(
                    totalRevenue
                ).toFixed(2)}.`,
            },
        };
    }

    // ==========================================
    // TOP 5 PRODUCTS
    // ==========================================

    if (
        lowerQuestion.includes("top 5 products") ||
        lowerQuestion.includes("top five products") ||
        lowerQuestion.includes("best selling products")
    ) {
        const products = await getTopProductsBySales();

        const formattedProducts = products
            .map(
                (product, index) =>
                    `${index + 1}. ${product.productId} - ${
                        product.category
                    } - ₹${Number(product.totalSales).toFixed(2)}`
            )
            .join("\n");

        return {
            success: true,
            data: {
                receivedQuestion: question,
                aiResponse:
                    `Top 5 products by sales:\n\n${formattedProducts}`,
            },
        };
    }

    // ==========================================
    // OTHER QUESTIONS → GEMINI AI
    // ==========================================

    const aiResponse = await getAIResponse(question);

    return {
        success: true,
        data: {
            receivedQuestion: question,
            aiResponse,
        },
    };
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    processQuestion,
};