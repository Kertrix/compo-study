"use server";

import { prisma } from "@/lib/prisma";

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function updateSubjectDescription(
  subjectId: string,
  content: string
): Promise<ActionResponse> {
  try {
    await prisma.subject.update({
      where: { id: subjectId },
      data: { examDescription: content },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating subject description:", error);
    return { success: false, error: "Failed to update subject description" };
  }
}
