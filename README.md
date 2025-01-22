This is based on [remix-auth-clerk](https://github.com/danestves/remix-auth-clerk), which is not supported by React Router v7, so we've updated the code in `app/auth/auth.server.ts`.

This uses the [remix-auth-oauth2](https://github.com/sergiodxa/remix-auth-oauth2) auth package.

The issue is that the Login URL generated returns a 404 on the hosted Clerk instance.

## Create an OAuth application in Clerk

You need to create an OAuth application in Clerk. You can do it via the [Backend API](https://clerk.com/docs/reference/backend-api/tag/OAuth-Applications) by providing a `callback_url`, a `name` and optionally the `scopes`.

```bash
curl
 -X POST https://api.clerk.com/v1/oauth_applications \
 -H "Authorization: Bearer <CLERK_SECRET_KEY>"  \
 -H "Content-Type: application/json" \
 -d {"callback_url":"https://example.com/auth/clerk/callback", "name": "remix-auth-clerk-example-app", "scopes": "profile email public_metadata"}
```

MAKE SURE TO USE THE SAME `CLERK_SECRET_KEY` AS YOU'LL DEFINE in `.dev.vars`.

Clerk will return the following:

```json
{
   "object":"oauth_application",
   "id":"###",
   "instance_id":"###",
   "name":"remix-auth-clerk-example-app",
   "client_id":"###",
   "client_secret":"###",
   "scopes":"profile email public_metadata",
   "callback_url":"https://example.com/auth/clerk/callback",
   "authorize_url":"https://clerk.your-domain.com/oauth/authorize",
   "token_fetch_url":"https://clerk.your-domain.com/oauth/token",
   "user_info_url":"https://clerk.your-domain.com/oauth/userinfo",
   "created_at":1680809847940,
   "updated_at":1680810135145
}
```

`clerk.your-domain.com` is the domain of your Clerk instance.

Make sure to substitue the values in `app/auth/auth.server.ts`. Currently hardcoded for ease, but don't forget to rename `.dev.vars.example` to `.dev.vars` and fill in the values there.


## Session Storage

We'll require to initialize a new Cookie Session Storage to work with. This Session will store user data and everything related to authentication.

Implemented in `app/auth/session.server.ts`.

## Auth Routes

Last but not least, we'll have created the routes that will handle the authentication flow.

```
app/auth/routes/auth.callback.route.tsx
app/auth/routes/auth.login.route.tsx
app/auth/routes/auth.logout.route.tsx
```
