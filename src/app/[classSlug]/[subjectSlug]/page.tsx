import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubjectsSelectionPage({
  params,
}: {
  params: { classSlug: string; subjectSlug: string };
}) {
  const { classSlug, subjectSlug } = await params;

  let selectedSubject;
  try {
    selectedSubject = await prisma.subject.findFirst({
      where: {
        slug: decodeURIComponent(subjectSlug),
        class: { slug: decodeURIComponent(classSlug) },
      },
      include: { class: true },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du sujet :", error);
    throw error;
  }

  if (!selectedSubject) {
    notFound();
  }

  return (
    <>
      <header className="mb-8 flex gap-4 items-center">
        <Button variant={"ghost"} size="icon" asChild>
          <Link href={`/${encodeURIComponent(selectedSubject.class.slug)}`}>
            <ArrowLeft aria-label="Retour à la sélection de matière" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-4xl">{selectedSubject.icon}</span>
          <div>
            <div className="flex gap-3 items-center">
              <h1 className="text-2xl font-semibold leading-tight">
                {selectedSubject.name}
              </h1>
              <div className="px-2 py-1 rounded-md bg-primary/10 text-xs font-medium text-primary">
                {selectedSubject.class.name}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dashboard de la matière
            </p>
          </div>
        </div>
      </header>
    </>
  );
}
