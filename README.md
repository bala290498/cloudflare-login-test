# Cloudflare Login — single source file

The complete frontend (HTML, CSS, browser JavaScript) and backend (Cloudflare
Worker login endpoint) are combined in `index.js`.

## Cloudflare credentials

Configure these in Worker Settings → Variables and Secrets:

- `APP_USERNAME` — text variable: `dummyuser`
- `APP_PASSWORD` — Secret: `dummy password`

## Deploy

Requires Node.js and npm.

1. Extract this ZIP and open a terminal in the extracted folder.
2. Install Wrangler: `npm install --save-dev wrangler`
3. Sign in: `npx wrangler login`
4. Add username secret:
   `npx wrangler secret put APP_USERNAME`
   Enter `dummyuser`.
5. Add password secret:
   `npx wrangler secret put APP_PASSWORD`
   Enter `dummy password`.
6. Deploy: `npx wrangler deploy`

The terminal prints your deployed Worker URL.

## Important

This is a demonstration credential check. It does not create a login session
or protect private pages. Do not use the success response as authorization.
For production, implement secure session cookies, protected routes, rate
limiting, logout, and cross-site request forgery protections.
