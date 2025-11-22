import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";
import { Suspense } from "react";
import { Classes } from "./classes";

export default async function ClassSelectionPage() {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full mx-auto space-y-12">
          <div className="space-y-3 text-center">
            <div className="bg-blue-600/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
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
            <Suspense
              fallback={
                <>
                  <Skeleton className="w-full h-[162px]" />
                  <Skeleton className="w-full h-[162px]" />
                </>
              }
            >
              <Classes />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
