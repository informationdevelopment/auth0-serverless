# auth0-serverless
Auth0 authentication for serverless functions.

**This package is no longer maintained and should not be used.**

### Installation
auth0-serverless can be installed with NPM:

```bash
npm install @informationdevelopment/auth0-serverless
```

### Usage
```javascript
const auth0 = require('@informationdevelopment/auth0-serverless');

const client = auth0.createClient(
    'example.auth0.com',                    // App domain
    'https://example.azurewebsites.net/api' // API identifier (audience)
);

module.exports = client.authorize('read:movies', async (context, req) => {
    return db.getMovies();
});
```
