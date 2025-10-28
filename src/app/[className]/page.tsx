import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubjectsSelectionPage({
  params,
}: {
  params: Promise<{ className: string }>;
}) {
  const { className } = await params;

  const selectedClass = await prisma.class.findUnique({
    where: { name: decodeURIComponent(className) },
    include: { subjects: true },
  });

  if (!selectedClass) {
    notFound();
  }

  const subjects = selectedClass.subjects.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-8 flex gap-4 items-center">
        <Button variant={"ghost"} size="icon" asChild>
          <Link href="classes">
            <ArrowLeft aria-label="Retour à la sélection de classe" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold leading-tight">
            {selectedClass.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez une matière
          </p>
        </div>
      </header>

      {subjects.length === 0 ? (
        <p className="text-center text-gray-600">
          Aucune matière disponible pour cette classe.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/${encodeURIComponent(className)}/${encodeURIComponent(subject.slug)}`}
              className={cn(
                "block p-6 rounded-lg border hover:shadow-lg hover:border-primary/30 transition-shadow duration-150 bg-white",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
              aria-label={`Ouvrir la matière ${subject.name}`}
            >
              <div className="flex flex-col justify-center gap-4">
                <div className="flex justify-between items-start">
                  <span className="text-4xl" aria-hidden>
                    {subject.icon ?? "📘"}
                  </span>
                  <div className="px-2 py-1 rounded-md bg-primary/10 text-xs font-medium text-primary">
                    {selectedClass.name}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold leadin-tight">
                    {subject.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cliquez pour accéder aux ressources
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
