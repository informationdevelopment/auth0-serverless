const jwksClient = require('jwks-rsa');

// Generate functions that jsonwebtoken.verify() can use
// to obtain Auth0 public keys asynchronously
module.exports.getSigningKey = domain => {
    const client = jwksClient({ jwksUri: `https://${domain}/.well-known/jwks.json` });
    return (header, callback) => {
        client.getSigningKey(header.kid, (err, key) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, key.publicKey || key.rsaPublicKey);
            }
        });
    };
};
