import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { oauthProvider } from "@better-auth/oauth-provider";

export const auth = betterAuth({
    disabledPaths: ["/token"],
    plugins: [
        jwt(),
        oauthProvider({
            loginPage: "/login",
            consentPage: "/consent",
        }),
    ],
});

export type Auth = typeof auth;