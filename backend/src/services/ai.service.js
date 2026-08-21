const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const getAIResponse = async (question) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: question,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
};

module.exports = {
    getAIResponse,
};