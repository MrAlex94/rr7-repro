import { createCookieSessionStorage } from "react-router";
import type { AppLoadContext, Session } from "react-router";

export function getSessionStorage(context: AppLoadContext) {
	return createCookieSessionStorage({
		cookie: {
			name: "__session",
			sameSite: "lax",
			path: "/",
			httpOnly: true,
			secrets: [context.cloudflare.env.CLERK_SESSION_SECRET],
			secure: process.env.NODE_ENV === "production",
		},
	});
}

export async function getSession(request: Request, context: AppLoadContext) {
	const storage = getSessionStorage(context);
	return storage.getSession(request.headers.get("Cookie"));
}

export async function commitSession(session: Session, context: AppLoadContext) {
	const storage = getSessionStorage(context);
	return storage.commitSession(session);
}

export async function destroySession(
	session: Session,
	context: AppLoadContext,
) {
	const storage = getSessionStorage(context);
	return storage.destroySession(session);
}
