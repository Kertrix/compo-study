"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "../lib/auth-client";
import { GoogleIcon } from "./icons";

export default function GoogleButton() {
  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={async () => {
        await authClient.signIn.social({
          provider: "google",
        });
      }}
    >
      <GoogleIcon /> Sign in with Google
    </Button>
  );
}
