import { type LoaderFunctionArgs, redirect } from "react-router";
import { authenticator } from "~/auth/auth.server";
import { sessionStorage } from "~/auth/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	console.log("🚀 | loader | request:", request.url);
	try {
		const user = await authenticator.authenticate("clerk", request);
		console.log("🚀 | loader | user:", user);
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
