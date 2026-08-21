const { processQuestion } = require("../services/chat.service");

const handleChat = async (req, res) => {
    try {
        const { question } = req.body;

        console.log("CHAT QUESTION:", question);

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        const response = await processQuestion(question);

        console.log("CHAT RESPONSE:", response);

        return res.status(200).json(response);

    } catch (error) {
        console.error("CHAT ERROR:", error);
        console.error("CHAT ERROR MESSAGE:", error.message);
        console.error("CHAT ERROR STACK:", error.stack);

        return res.status(500).json({
            success: false,
            message: "Chat failed",
            error: error.message,
        });
    }
};

module.exports = {
    handleChat,
};