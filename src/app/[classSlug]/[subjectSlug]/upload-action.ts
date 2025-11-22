"use server";

import { Prisma } from "@/generated/client";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { uploadFileToS3 } from "./awss3-util";

export async function uploadAction(
  formData: FormData,
  subject: Prisma.SubjectGetPayload<{ include: { class: true } }>
) {
  try {
    const files = formData.getAll("files");
    console.log(files);

    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    for (const f of files) {
      if (f instanceof File) {
        const url = await uploadFileToS3({
          file: f,
          prefix: `${subject.class.slug}/${subject.slug}`,
          filename: f.name,
        });

        if (!url) {
          throw new Error("File upload failed");
        }

        await prisma.ressource.create({
          data: {
            title: f.name,
            authorId: user.id,
            resourceType: "DOCUMENT",
            type: "OTHER",
            mimeType: f.type,
            fileUrl: url,
            subjectId: subject.id,
          },
        });
      } else {
        console.log("[server action] Field value:", String(f));
      }
    }

    return;
  } catch (err) {
    console.error("[server action] Error:", err);
    return;
  }
}
