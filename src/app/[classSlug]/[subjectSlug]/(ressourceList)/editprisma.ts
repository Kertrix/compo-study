"use server";

import { prisma } from "@/lib/prisma";

export default async function createTag(formData: FormData) {
  console.log("Creating default tag categories...");
  // await prisma.tagCategory.createMany({
  //   data: [
  //     { name: "Type", slug: "type" },
  //     { name: "RessourceType", slug: "ressource-type" },
  //   ],
  //   skipDuplicates: true,
  // });
  await prisma.tag.create({
    data: {
      categoryId: "jrb1tf1rxhfz06b5k844imma",
      name: "PDF",
      slug: "pdf",
    },
  });
  return;
}

// <form action={createTag}>
// <button type="submit" className="hover:bg-red-500 p-2">
// Create
// </button>
// </form>
