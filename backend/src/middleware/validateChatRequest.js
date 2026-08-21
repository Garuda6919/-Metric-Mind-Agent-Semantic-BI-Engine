const MESSAGES = require("../utils/messages");
const { errorResponse } = require("../utils/response");

const validateChatRequest = (req, res, next) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json(
            errorResponse(MESSAGES.QUESTION_REQUIRED)
        );
    }

    next();
};

module.exports = validateChatRequest;