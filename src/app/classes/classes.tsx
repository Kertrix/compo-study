import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Classes = async () => {
  const classes = await prisma.class.findMany({
    orderBy: { name: "desc" },
  });

  return (
    <>
      {classes.map((classItem) => (
        <Link
          href={encodeURIComponent(classItem.slug)}
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
    </>
  );
};
