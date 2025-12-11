"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function loginAction(password: string) {
  if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
    // Student login
    const cookieStore = await cookies();
    cookieStore.set("studentAccess", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 31 * 24 * 60 * 60, // 31 days
      sameSite: "strict",
    });
    return { success: true };
  } else if (password === process.env.TEACHER_PASSWORD) {
    // Teacher login
    const cookieStore = await cookies();
    cookieStore.set("teacherAccess", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
    });
    return { success: true };
  } else {
    return { success: false };
  }
}

export async function logoutAction(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}

export async function anonymousLogoutAction(): Promise<void> {
  const cookie = await cookies();
  cookie.delete("studentAccess");
  cookie.delete("teacherAccess");
  redirect("/");
}
