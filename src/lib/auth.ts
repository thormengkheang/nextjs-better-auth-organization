import { betterAuth } from "better-auth";
import {
  bearer,
  admin,
  multiSession,
  organization,
  twoFactor,
  openAPI,
} from "better-auth/plugins";
import { reactInvitationEmail } from "./email/invitation";
import { reactResetPasswordEmail } from "./email/reset-password";
import { resend } from "./email/resend";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { createClient } from "redis";
import type { RedisClientType } from "redis";

interface SecondaryStorage {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

let redis: RedisClientType | undefined;
let secondaryStorage: SecondaryStorage | undefined;

const isRedisConfigured =
  !!process.env.REDIS_HOST &&
  !!process.env.REDIS_PORT &&
  !!process.env.REDIS_PASSWORD;

if (isRedisConfigured) {
  try {
    redis = isRedisConfigured
      ? createClient({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
          password: process.env.REDIS_PASSWORD,
        })
      : createClient();

    await redis.connect();
    console.log("✅ Redis connected");

    secondaryStorage = {
      get: async (key) => {
        const value = await redis!.get(key);
        return value ?? null;
      },
      set: async (key, value, ttl) => {
        if (ttl) await redis!.set(key, value, { EX: ttl });
        else await redis!.set(key, value);
      },
      delete: async (key) => {
        await redis!.del(key);
      },
    };
  } catch (err) {
    console.warn("⚠️ Redis connection failed — continuing without Redis:", err);
  }
}

export const auth = betterAuth({
  // store rate limit count on secondary storage
  rateLimit: {
    storage: "secondary-storage",
    window: 10,
    max: 100,
  },
  appName: "Better Auth Organization Demo",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.user,
    },
  }),
  // use redis for temporary session cache
  ...(secondaryStorage && { secondaryStorage }),
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        await resend.emails.send({
          from,
          to: data.email,
          subject: "You've been invited to join an organization",
          react: reactInvitationEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink:
              process.env.NODE_ENV === "development"
                ? `http://localhost:3000/accept-invitation/${data.id}`
                : `${
                    process.env.BETTER_AUTH_URL ||
                    "https://demo.better-auth.com"
                  }/accept-invitation/${data.id}`,
          }),
        });
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await resend.emails.send({
            from,
            to: user.email,
            subject: "Your OTP",
            html: `Your OTP is ${otp}`,
          });
        },
      },
    }),
    openAPI(),
    bearer(),
    admin({
      adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
    }),
    multiSession(),
    nextCookies(),
  ],
  trustedOrigins: ["https://localhost:3000"],
  session: {
    storeSessionInDatabase: true,
    preserveSessionInDatabase: false,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});
