import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";
import { z } from "zod";

const schema = z.object({
	APP_URL: z.string(),
	CLERK_CLIENT_ID: z.string(),
	CLERK_CLIENT_SECRET: z.string(),
	CLERK_ISSUER: z.string(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
	CLERK_SESSION_SECRET: z.string(),
});

declare module "react-router" {
	interface AppLoadContext {
		env: z.infer<typeof schema> & {
			cf: CfProperties;
		};
	}
}

interface CloudflareLoadContext {
	context: {
		cloudflare: Omit<PlatformProxy<unknown>, "dispose">;
	};
	request: Request;
}

export function getLoadContext({
	context,
}: CloudflareLoadContext): AppLoadContext {
	const {
		APP_URL,
		CLERK_CLIENT_ID,
		CLERK_CLIENT_SECRET,
		CLERK_ISSUER,
		CLERK_PUBLISHABLE_KEY,
		CLERK_SECRET_KEY,
		CLERK_SESSION_SECRET,
	} = schema.parse(context.cloudflare.env);

	return {
		env: {
			cf: context.cloudflare.cf,
			APP_URL,
			CLERK_CLIENT_ID,
			CLERK_CLIENT_SECRET,
			CLERK_ISSUER,
			CLERK_PUBLISHABLE_KEY,
			CLERK_SECRET_KEY,
			CLERK_SESSION_SECRET,
		},
	};
}
