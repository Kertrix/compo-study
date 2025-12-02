import { NavUser } from "@/components/nav-user";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewRessourceForm from "./(createRessource)/new-ressource-form";
import RessourceGrid from "./(ressourceList)/grid";

export default async function SubjectsSelectionPage({
  params,
}: {
  params: { classSlug: string; subjectSlug: string };
}) {
  const { classSlug, subjectSlug } = await params;
  const user = await getUser();

  const cookieStore = await cookies();
  const allowed =
    user?.role === "ADMIN" ||
    cookieStore.get("teacherAccess")?.value === "true";

  let selectedSubject;
  try {
    selectedSubject = await prisma.subject.findFirst({
      where: {
        slug: decodeURIComponent(subjectSlug),
        class: { slug: decodeURIComponent(classSlug) },
      },
      include: { class: true, ressources: { include: { tags: true } } },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du sujet :", error);
    throw error;
  }

  if (!selectedSubject) {
    notFound();
  }

  const tagCategories = await prisma.tagCategory.findMany({
    include: {
      tags: {
        where: { ressources: { some: { subjectId: selectedSubject.id } } },
      },
    },
  });

  return (
    <>
      <div className="flex-1">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex gap-4 items-center">
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
          </div>
          {user && (
            <NavUser
              name={user.name}
              role={user.role}
              image={user.image ?? undefined}
              email={user.email}
            />
          )}
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col bg-muted/60 border p-5 rounded-lg">
            <span className="leading-tight text-md font-medium text-muted-foreground">
              Date de l&apos;examen
            </span>
            <p className="text-xl font-semibold mt-2">
              {selectedSubject.examDate
                ? selectedSubject.examDate.toLocaleDateString()
                : "December 15, 2025"}
            </p>
            <p className="text-sm">
              {selectedSubject.examDescription ||
                "Aucune description d'examen disponible."}
            </p>
          </div>
          <div className="flex flex-col bg-muted/60 border p-5 rounded-lg">
            <span className="leading-tight text-md font-medium text-muted-foreground">
              Durée l&apos;examen
            </span>
            <p className="text-xl font-semibold mt-2">
              {selectedSubject.examLength || "2 heures"}
            </p>
            <p className="text-sm">
              {selectedSubject.examDescription || "Durée totale"}
            </p>
          </div>
        </section>
        <section className="mt-4">
          <div className="grid grid-cols-2 mb-6">
            {allowed && (
              <Accordion
                className="w-full space-y-2"
                collapsible
                defaultValue="3"
                type="single"
              >
                <AccordionItem
                  className="rounded-md border bg-background px-4 py-1 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                  value="1"
                >
                  <AccordionTrigger className="py-2 cursor-pointer text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                    <span className="flex items-center gap-2">
                      <PlusCircle size={16} />
                      Créer une nouvelle ressource ressource
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 text-muted-foreground">
                    <NewRessourceForm subject={selectedSubject} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>

          <RessourceGrid
            subject={selectedSubject}
            tagCategories={tagCategories}
          />
        </section>
      </div>
    </>
  );
}
