import { APIError, betterAuth, User } from "better-auth";

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
  databaseHooks: {
    user: {
      create: {
        before: async (user: User) => {
          const email = user.email.toLowerCase();

          const isStudent = email.endsWith("@ejm.org");
          const isTeacher = email.endsWith("@ejm.net");

          if (!email) {
            throw new Error("Email is required");
          }

          if (!isStudent && !isTeacher) {
            throw new APIError("UNAUTHORIZED", {
              message:
                "Seuls les comptes de l'école Jeannine Manuel (@ejm.org / @ejm.net) sont autorisés. Veuillez réessayer.",
            });
          }
          const role = isStudent ? "STUDENT" : "PROFESSOR";

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
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
