const buildError = (statusCode, message) => ({
    statusCode,
    headers: {
        'content-type': 'application/json',
    },
    body: {
        err: message,
    },
});

module.exports = {
    RES_401_UNAUTHORIZED: buildError(401, 'Unauthorized'),
    RES_403_FORBIDDEN: buildError(403, 'Forbidden'),
    RES_500_INTERNAL_SERVER_ERROR: buildError(500, 'Internal Server Error'),
};
