import { type ActionFunctionArgs, useNavigation } from "react-router";
import { authenticator } from "~/auth/auth.server";

export const action = ({ request }: ActionFunctionArgs) => {
	return authenticator.authenticate("clerk", request);
};
