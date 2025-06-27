import { createAuthClient } from "better-auth/react";
import {
  organizationClient,
  twoFactorClient,
  adminClient,
  multiSessionClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";

export const client = createAuthClient({
  plugins: [
    organizationClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/two-factor";
      },
    }),
    adminClient(),
    multiSessionClient(),
  ],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = client;
