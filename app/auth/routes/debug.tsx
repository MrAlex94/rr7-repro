import { type LoaderFunctionArgs, useLoaderData } from "react-router";

export async function loader({ context }: LoaderFunctionArgs) {
	// Don't do this in production!
	// if (process.env.NODE_ENV === 'production') {
	//   throw new Error('Debug route not available in production');
	// }

	return {
		env: {
			...context.env,
			// Redact sensitive values
			CLERK_SECRET_KEY: context.env.CLERK_SECRET_KEY ? "[REDACTED]" : undefined,
			CLERK_SESSION_SECRET: context.env.CLERK_SESSION_SECRET
				? "[REDACTED]"
				: undefined,
		},
	};
}

export default function Debug() {
	const data = useLoaderData<typeof loader>();
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
