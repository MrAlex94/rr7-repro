import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";
import { z } from "zod";

const schema = z.object({
	CLERK_SECRET_KEY: z.string(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SIGN_UP_URL: z.string(),
	CLERK_SIGN_IN_URL: z.string(),
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
		CLERK_SECRET_KEY,
		CLERK_PUBLISHABLE_KEY,
		CLERK_SIGN_UP_URL,
		CLERK_SIGN_IN_URL,
	} = schema.parse(context.cloudflare.env);

	return {
		env: {
			cf: context.cloudflare.cf,
			CLERK_SECRET_KEY,
			CLERK_PUBLISHABLE_KEY,
			CLERK_SIGN_UP_URL,
			CLERK_SIGN_IN_URL,
		},
	};
}
