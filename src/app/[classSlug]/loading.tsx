import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1">
      <div className="flex items-center space-x-4 mb-10">
        <Button variant={"ghost"} size="icon">
          <ArrowLeft aria-label="Retour à la sélection de matière" />
        </Button>
        <div className="space-y-2">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[154px] w-full" />
        ))}
      </div>
    </div>
  );
}
