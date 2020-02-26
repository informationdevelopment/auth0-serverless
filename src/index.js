const serverless = require('./serverless');
const authorize = require('./authorize');

module.exports.createClient = (options) => ({
    authorize: (scope, handler) => async (...args) => {
        const wrapper = serverless.getWrapper(args);
        const result = await authorize({ ...options, scope, wrapper });
        if (result.authorized) {
            return handler(...args);
        }
        return result.errorResponse;
    },

    authorizeSync: (scope, handler) => (...args) => {
        const wrapper = serverless.getWrapper(args);
        authorize({ ...options, scope, wrapper }).then(result => {
            if (result.authorized) {
                handler(...args);
            }
            // No need to return an error here; error responses
            // for synchronous functions are handled in authorize().
        });
    },
});
