import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "~/lib/theme";

const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "theme",
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secrets: ["secret"],
		...(isProduction ? { secure: true } : {}),
	},
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
