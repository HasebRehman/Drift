# Private site access

The storefront is locked by default. All pages, product URLs, APIs, and public
assets require a valid signed cookie. Next.js runtime bundles remain accessible;
neither private environment variable is included in them. The password screen is
standalone HTML, so the storefront does not flash before login.

## Set your password locally

Create `.env.local` in the repository root (next to `package.json`):

```dotenv
SITE_PASSWORD="your-own-long-unique-password"
SITE_ACCESS_SECRET="your-own-random-secret-at-least-32-characters-long"
```

Use a unique password of at least 12 characters. Generate a separate signing secret:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Paste the generated value into `SITE_ACCESS_SECRET`. Do not share it with visitors.
Restart the development server after setting or changing these variables.
`.env.local` and other real `.env` files are ignored by Git; `.env.example` contains
only empty placeholders and can be committed. Never add `NEXT_PUBLIC_` to these names.
If a secret was previously committed, ignoring the file does not remove it from
Git history: rotate that secret.

## Live deployment

In your hosting project's environment/secrets settings, add `SITE_PASSWORD` and
`SITE_ACCESS_SECRET` with your real values. Enable them for production and any
preview deployments you want to unlock, then redeploy. Use an HTTPS deployment
with the Next.js server/runtime enabled; this gate cannot work on a static export.
No actual password should be placed in GitHub, the code, or `.env.example`.

For Vercel, use Project Settings → Environment Variables. For another host, use
its equivalent private server environment settings. Set both variables on every
instance, using the same values across instances of a deployment.

## Behavior

- The white page contains a centered password field and Enter button.
- The correct password opens the originally requested page.
- An incorrect password stays on the password page.
- Access expires after 24 hours. A private browser window starts locked.
- Changing either private variable invalidates existing access cookies after restart/redeploy.
- Missing or invalid configuration keeps the storefront locked.
- Cookies are signed, HttpOnly, SameSite=Lax, and Secure in production.
- Five failed attempts trigger a 15-minute per-IP limit within each server process.
  On serverless/multiple-instance hosting, also configure a shared hosting/WAF rate
  limit for `POST /password`; the in-memory limit resets when an instance restarts.

This is a shared storefront password, not individual customer-account authentication.
Run the targeted checks with `node --test tests/site-access.test.cjs`.
