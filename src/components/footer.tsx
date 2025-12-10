"use client";

import { anonymousLogoutAction } from "@/lib/server";
import { LockKeyhole } from "lucide-react";

export default function Footer({
  isGuest,
  isTeacher,
}: {
  isGuest: boolean;
  isTeacher: boolean;
}) {
  return (
    <footer className="flex flex-col items-center mt-10 gap-2">
      {(isGuest || isTeacher) && (
        <>
          {isTeacher && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <LockKeyhole size={16} /> Connexion professeur
            </span>
          )}

          <p
            className="text-sm cursor-pointer hover:underline"
            onClick={() => anonymousLogoutAction()}
          >
            Se déconnecter
          </p>
        </>
      )}
      {/* <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} EJM Compo Study. Créé par Adam Giraud et
        Tristan Kermorvant
      </p> */}
    </footer>
  );
}
