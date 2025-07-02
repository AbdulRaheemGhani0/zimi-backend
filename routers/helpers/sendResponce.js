function sendResponse(res, data, status = 200, error = null, msg = "Data Fetched successfully") {
    return res.status(status).json({
        error: error,
        msg: msg,
        data: data,
    });
}

module.exports = sendResponse; // Correct CommonJS export
