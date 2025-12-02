"use server";

import { Prisma } from "@/generated/client";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { RessourceSchema } from "./(createRessource)/new-ressource-form";
import { uploadFileToS3 } from "./awss3-util";

export async function uploadAction(
  formData: z.infer<typeof RessourceSchema>,
  subject: Prisma.SubjectGetPayload<{ include: { class: true } }>
) {
  try {
    const files = formData.files;

    if (formData.title === undefined || formData.title === "") {
      formData.title = files[0].name;
    }

    if (!files) {
      throw new Error("No files provided");
    }

    const user = await getUser();

    const thumbnailFile = formData.thumbnail;
    let thumbnailUrl: string | undefined;

    if (thumbnailFile) {
      thumbnailUrl = await uploadFileToS3({
        file: thumbnailFile,
        prefix: `${subject.class.slug}/${subject.slug}`,
        filename: `thumbnail_${thumbnailFile.name}`,
      });
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
            title: formData.title,
            authorId: user?.id,
            description: formData.description,
            mimeType: f.type,
            fileUrl: url,
            thumbnailUrl:
              f.type === "application/pdf" ? thumbnailUrl : undefined,
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
