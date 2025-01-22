import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";

interface ClerkUserInfo {
	user_id: string;
	email?: string;
	name?: string;
	picture?: string;
}

export type User = {
	id: string;
	email?: string;
	name: string;
	photo?: string;
	tokens: {
		accessToken: string;
		refreshToken: string | null;
		tokenType: string;
		expiresAt: Date;
	};
};

export const authenticator = new Authenticator<User>();

const strategy = new OAuth2Strategy(
	{
		clientId: "###",
		clientSecret: "###",
		redirectURI: "http://localhost:5173/auth/callback",
		authorizationEndpoint: "https://clerk.your-domain.com/oauth/authorize",
		tokenEndpoint: "https://clerk.your-domain.com/oauth/token",
		scopes: ["profile", "email"],
	},
	async ({ tokens, request }) => {
		const response = await fetch(
			"https://clerk.your-domain.com/oauth/userinfo",
			{
				headers: { Authorization: `Bearer ${tokens.accessToken()}` },
			},
		);

		const userInfo = (await response.json()) as ClerkUserInfo;

		return {
			id: userInfo.user_id,
			email: userInfo.email,
			name: userInfo.name || userInfo.email || userInfo.user_id,
			photo: userInfo.picture,
			tokens: {
				accessToken: tokens.accessToken(),
				refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
				tokenType: tokens.tokenType(),
				expiresAt: tokens.accessTokenExpiresAt(),
			},
		};
	},
);

authenticator.use(strategy, "clerk");

function isTokenExpiringSoon(expiresAt: Date): boolean {
	const timeUntilExpiry = expiresAt.getTime() - Date.now();
	const twentyMinutesInMs = 20 * 60 * 1000;

	return timeUntilExpiry < twentyMinutesInMs;
}

export async function requireAuth(request: Request) {
	try {
		const user = await authenticator.authenticate("clerk", request);

		if (
			request.method === "GET" &&
			user.tokens.refreshToken &&
			isTokenExpiringSoon(user.tokens.expiresAt)
		) {
			const tokens = await strategy.refreshToken(user.tokens.refreshToken);

			const session = await sessionStorage.getSession(
				request.headers.get("cookie"),
			);
			user.tokens = {
				accessToken: tokens.accessToken(),
				refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
				tokenType: tokens.tokenType(),
				expiresAt: tokens.accessTokenExpiresAt(),
			};
			session.set("user", user);

			throw redirect(request.url, {
				headers: {
					"Set-Cookie": await sessionStorage.commitSession(session),
				},
			});
		}
		return user;
	} catch (error) {
		throw redirect("/login");
	}
}

export async function tryAuth(request: Request) {
	try {
		return await authenticator.authenticate("clerk", request);
	} catch (error) {
		return null;
	}
}
