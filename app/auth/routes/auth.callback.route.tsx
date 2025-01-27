import { type LoaderFunctionArgs, redirect } from "react-router";
import { createAuthenticator } from "~/auth/auth.server";
import { getSessionStorage } from "~/auth/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const { authenticator } = createAuthenticator(context);
	try {
		const user = await authenticator.authenticate("clerk", request);
		const sessionStorage = getSessionStorage(context);
		const session = await sessionStorage.getSession(
			request.headers.get("cookie"),
		);
		session.set("user", user);

		return redirect("/", {
			headers: {
				"Set-Cookie": await sessionStorage.commitSession(session),
			},
		});
	} catch (error) {
		console.error("🚀 | loader | error:", error);
		throw error;
	}
};
