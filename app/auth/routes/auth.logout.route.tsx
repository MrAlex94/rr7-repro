import { type ActionFunctionArgs, redirect } from "react-router";
import { getSessionStorage } from "~/auth/session.server";

export const loader = async ({ request, context }: ActionFunctionArgs) => {
	const sessionStorage = getSessionStorage(context);
	const session = await sessionStorage.getSession(
		request.headers.get("cookie"),
	);
	return redirect("/login", {
		headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
	});
};
