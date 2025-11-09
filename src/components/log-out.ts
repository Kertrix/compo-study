"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function anonymousLogoutAction(): Promise<void> {
  const cookie = await cookies();
  cookie.set("studentAccess", "", { maxAge: 0, path: "/" });

  revalidatePath("/", "layout");
  redirect("/");
}
