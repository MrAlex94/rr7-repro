import { type LoaderFunctionArgs, useLoaderData } from "react-router";

export async function loader({ context }: LoaderFunctionArgs) {
	// Don't do this in production!
	// if (process.context.cloudflare.envNODE_ENV === 'production') {
	//   throw new Error('Debug route not available in production');
	// }

	return {
		env: {
			APP_URL: context.context.cloudflare.APP_URL,
		},
	};
}

export default function Debug() {
	const data = useLoaderData<typeof loader>();
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
