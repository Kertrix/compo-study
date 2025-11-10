"use client";

import { anonymousLogoutAction } from "@/lib/server";

export default function Footer({ isGuest }: { isGuest: boolean }) {
  return (
    <footer className="flex flex-col items-center mt-10 gap-2">
      {isGuest && (
        <p
          className="text-sm cursor-pointer hover:underline"
          onClick={() => anonymousLogoutAction()}
        >
          Se déconnecter
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} EJM Compo Study. Créé par Adam Giraud et
        Tristan Kermorvant
      </p>
    </footer>
  );
}
