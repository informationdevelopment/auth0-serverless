const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { getSigningKey } = require('./jwks');
const verifyScope = require('./scope').verify;
const errors = require('./errors');

// Auth0 only supports RS256 and HS256
const ALLOWED_SIGNING_ALGORITHMS = ['RS256', 'HS256'];

module.exports = async ({ domain, apiId, key, scope, wrapper }) => {
    try {
        function sendError(errorResponse) {
            const res = wrapper.formatResponse(errorResponse);
            wrapper.sendResponse(res);
            return {
                authorized: false,
                errorResponse: res,
            };
        };

        const { headers } = wrapper.req;

        if (!headers.authorization) {
            wrapper.log.error('missing access token');
            return sendError(errors.RES_401_UNAUTHORIZED);
        }

        // The actual token begins after the "Bearer " string.
        const token = headers.authorization.slice(7);

        // If no key is provided, use a function that gets a public key hosted on the Auth0 tenant.
        const signingKey = key || getSigningKey(domain);

        const options = {
            algorithms: ALLOWED_SIGNING_ALGORITHMS,
            audience: apiId,
            issuer: `https://${domain}/`,
        };

        // Decode and check the token. Throws an error if the token is invalid.
        const payload = await promisify(jwt.verify).call(jwt, token, signingKey, options);

        // Ensure that all scopes required by the function handler
        // are included in the list of token scopes.
        if (verifyScope(scope, payload.scope)) {
            wrapper.log('successful authorization');
            return { authorized: true };
        }
        else {
            wrapper.log.error('invalid jwt scope');
            return sendError(errors.RES_403_FORBIDDEN);
        }
    }
    catch (err) {
        wrapper.log.error(err.toString());
        if (err instanceof jwt.JsonWebTokenError) {
            return sendError(errors.RES_401_UNAUTHORIZED);
        }
        return sendError(errors.RES_500_INTERNAL_SERVER_ERROR);
    }
};
