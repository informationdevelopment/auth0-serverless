module.exports.getWrapper = (args) => {
    const method =
        args[0].httpMethod                      // AWS Lambda (proxy integration), Netlify Functions
        || args[0].method                       // Google Cloud Functions, Express
        || (args[0].req && args[0].req.method); // Azure Functions
    const headers =
        args[0].headers                             // AWS, Netlify, GCP, Express
        || (args[0].req && args[0].req.headers);    // Azure
    const endpoint =
        args[0].originalUrl     // GCP, Express, Azure
        || args[0].path;        // AWS, Netlify


    const formatLogMessage = message => `auth0-serverless: ${message} (${method} ${endpoint})`;

    const wrapper = {
        req: { method, headers, endpoint },

        formatResponse: ({ statusCode, headers, body }) => ({
            statusCode,
            status: statusCode,
            headers,
            body: JSON.stringify(body),
        }),

        sendResponse(res) {
            if (args[1].awsRequestId) { // AWS Lambda (proxy integration), Netlify Functions
                args[2](null, res);
            }
            else if (args[0].done) {     // Azure Functions
                // Returning the response via context.done in addition to
                // assigning to context.res ensures that $return HTTP output bindings
                // will work in addition to named bindings.
                args[0].done(args[0].res = res);
            }
            else if (args[1].send) {    // Google Cloud Functions, Express
                args[1].set(res.headers);
                args[1].status(res.statusCode).send(res.body);
            }
        },

        log(message) {
            const msg = formatLogMessage(message);
            if (args[0].log) {
                // Use Azure's context.log
                args[0].log(msg);
            }
            console.log(msg);
        },
    };

    wrapper.log.error = message => {
        const msg = formatLogMessage(message);
        if (args[0].log && args[0].log.error) {
            // Use Azure's context.log.error
            args[0].log.error(msg);
        }
        console.error(msg);
    };
    return wrapper;
};
