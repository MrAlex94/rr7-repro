import { type ActionFunctionArgs, useNavigation } from "react-router";
import { createAuthenticator } from "~/auth/auth.server";

export const action = ({ request, context }: ActionFunctionArgs) => {
	const { authenticator } = createAuthenticator(context);
	return authenticator.authenticate("clerk", request);
};
