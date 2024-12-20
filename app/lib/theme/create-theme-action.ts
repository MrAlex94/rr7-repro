import type { ActionFunction } from "react-router";
import { isTheme } from "./theme-provider";
import type { ThemeSessionResolver } from "./theme-server";

export const createThemeAction = (
	themeSessionResolver: ThemeSessionResolver,
): ActionFunction => {
	const action: ActionFunction = async ({ request }) => {
		const session = await themeSessionResolver(request);
		const requestData = (await request.json()) as { theme?: unknown };
		const { theme } = requestData;

		if (!theme) {
			return new Response(JSON.stringify({ success: true }), {
				headers: {
					"Set-Cookie": await session.destroy(),
					"Content-Type": "application/json",
				},
			});
		}

		if (!isTheme(theme)) {
			return new Response(
				JSON.stringify({
					success: false,
					message: `theme value of ${theme} is not a valid theme.`,
				}),
				{
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		session.setTheme(theme);
		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Set-Cookie": await session.commit(),
				"Content-Type": "application/json",
			},
		});
	};
	return action;
};
