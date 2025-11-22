import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, BookPlus, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import RessourceCard from "./ressource-card";
import UploadRessourceDialog from "./upload-dialog";

export default async function SubjectsSelectionPage({
  params,
}: {
  params: { classSlug: string; subjectSlug: string };
}) {
  const { classSlug, subjectSlug } = await params;
  const user = await getUser();

  let selectedSubject;
  try {
    selectedSubject = await prisma.subject.findFirst({
      where: {
        slug: decodeURIComponent(subjectSlug),
        class: { slug: decodeURIComponent(classSlug) },
      },
      include: { class: true, ressources: true },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du sujet :", error);
    throw error;
  }

  if (!selectedSubject) {
    notFound();
  }

  const courses = selectedSubject.ressources.filter((r) => r.type === "COURSE");
  const sheets = selectedSubject.ressources.filter(
    (r) => r.type === "REVISION"
  );

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
        <section className="grid grid-cols-2 gap-4">
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
        <section className="mt-8">
          <Tabs defaultValue="lesson" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="lesson">
                <BookOpen /> Cours ({courses.length})
              </TabsTrigger>
              <TabsTrigger value="sheets">
                <FileText />
                Fiches de révision ({sheets.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lesson">
              {courses.length === 0 ? (
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BookOpen />
                    </EmptyMedia>
                    <EmptyTitle>
                      Aucun cours disponible pour le moment 😴
                    </EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <UploadRessourceDialog subject={selectedSubject} />
                    {/* <Button>
                      <BookPlus />
                      Uploader un cours
                    </Button> */}
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <RessourceCard
                      key={course.id}
                      title={course.title}
                      description={course.description}
                      resourceType={course.resourceType}
                      updatedAt={course.updatedAt}
                      Icon={FileText}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="sheets">
              {sheets.length === 0 ? (
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileText />
                    </EmptyMedia>
                    <EmptyTitle>
                      Aucune fiche de révision disponible pour le moment 😴
                    </EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button>
                      <BookPlus />
                      Uploader une fiche de révision
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {sheets.map((sheet) => (
                    <RessourceCard
                      key={sheet.id}
                      title={sheet.title}
                      description={sheet.description}
                      resourceType={sheet.resourceType}
                      updatedAt={sheet.updatedAt}
                      Icon={FileText}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}
