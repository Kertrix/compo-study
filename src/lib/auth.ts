import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/sign-in")) {
        return;
      }
      const newSession = ctx.context.newSession;
      const email = newSession?.user?.email;
      if (email && !email.endsWith("@ejm.net")) {
        throw new APIError("FORBIDDEN", {
          message: "Only ejm.net email addresses are allowed",
        });
      }
    }),
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true,
      },
    },
  },
});
