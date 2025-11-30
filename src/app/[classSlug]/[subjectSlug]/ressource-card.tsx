import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

export default function RessourceCard({
  title,
  description,
  updatedAt,
  Icon,
  thumbnailUrl,
}: {
  title: string;
  description: string | null;
  updatedAt: Date;
  Icon: LucideIcon;
  thumbnailUrl?: string | null;
}) {
  return (
    <AspectRatio
      ratio={1 / 1}
      className="w-full rounded-lg overflow-hidden border bg-muted relative"
    >
      {thumbnailUrl ? (
        <>
          <Image
            src={thumbnailUrl}
            alt={title}
            fill={true}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/100" />
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="p-2 border mb-8 rounded-xl bg-blue-600/10">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 bg-white py-2 border-t w-full flex flex-col items-center justify-center">
        <h3
          className="font-semibold text-md leading-tight truncate"
          title={title}
        >
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
          Lorem ipsum &nbsp;•&nbsp;
          {updatedAt.toLocaleDateString()}
        </p>
      </div>
    </AspectRatio>
  );
}
