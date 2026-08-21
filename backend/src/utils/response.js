const successResponse = (data) => {
    return {
        success: true,
        data
    };
};

const errorResponse = (message) => {
    return {
        success: false,
        message
    };
};

module.exports = {
    successResponse,
    errorResponse
};