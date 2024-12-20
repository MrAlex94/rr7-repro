import { ClerkProvider } from "@clerk/react-router";
import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import clsx from "clsx";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from "react-router";
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "~/lib/theme";
import stylesheet from "~/style.css?url";
import { themeSessionResolver } from "~/theme-session.server";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export async function loader(args: Route.LoaderArgs) {
	return rootAuthLoader(
		args,
		async ({ request }) => {
			const { getTheme } = await themeSessionResolver(request);
			return { theme: getTheme() };
		},
		{ loadUser: true },
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	const [theme] = useTheme();

	return (
		<html lang="en" className={clsx(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />

				<Meta />
				<Links />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
			</head>
			<body className="flex min-h-screen w-full flex-col">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App({ loaderData }: Route.ComponentProps) {
	if (!loaderData) {
		return null;
	}

	const theme =
		loaderData &&
			"theme" in loaderData &&
			typeof loaderData.theme !== "undefined"
			? loaderData.theme
			: null;

	return (
		<ClerkProvider>
			<ThemeProvider specifiedTheme={theme} themeAction="/action/set-theme">
				<Layout>
					<Outlet />
				</Layout>
			</ThemeProvider>
		</ClerkProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
