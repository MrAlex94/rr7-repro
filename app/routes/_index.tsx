import { createClerkClient } from "@clerk/react-router/api.server";
import { getAuth } from "@clerk/react-router/ssr.server";
import { type MetaFunction, useLoaderData, useNavigation } from "react-router";
import type { Route } from "./+types/root";

export const meta: MetaFunction = () => {
	return [{ title: "Repro" }, { name: "description", content: "Repro" }];
};

export async function loader(args: Route.LoaderArgs) {
	const { userId } = await getAuth(args);

	if (!userId) {
		return {
			user: null,
		};
	}

	const user = await createClerkClient({
		secretKey: args.context.env.CLERK_SECRET_KEY,
	}).users.getUser(userId);

	return {
		user: JSON.stringify(user),
	};
}

export default function IndexRoute() {
	const { user } = JSON.parse(JSON.stringify(useLoaderData<typeof loader>()));

	if (user) {
		return "Signed In";
	}

	return (
		<div>
			Signed Out <br />
			<form action="/login" method="post" style={{ display: "inline" }}>
				<button
					className="rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 transition active:scale-110"
					type="submit"
				>
					Sign In
				</button>
			</form>
		</div>
	);
}
