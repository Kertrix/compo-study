import { prisma } from "@/lib/prisma";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function ClassSelectionPage() {
  const classes = await prisma.class.findMany();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-12">
        <div className="space-y-3 text-center">
          <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
            <GraduationCap className="h-10 w-10 text-blue-600 " />
          </div>

          <h1 className="text-5xl font-semibold tracking-tight">
            Choisis ta classe
          </h1>

          <p className="sm:max-w-xl text-balance mx-auto text-muted-foreground">
            Une seule interface élégante pour retrouver fiches, notes et
            conseils sur-mesure. Commence par sélectionner ton niveau.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {classes.map((classItem) => (
            <Link
              href={encodeURIComponent(classItem.name)}
              key={classItem.id}
              className="p-6 border rounded-lg relative flex flex-col gap-4 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg"
            >
              <ArrowRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4" />
              <span className="text-sm py-1 px-4 w-fit rounded-full bg-indigo-500/15 text-indigo-500">
                Promo 2027
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                {classItem.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Classe de {classItem.name.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
