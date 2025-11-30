import { LucideIcon } from "lucide-react";

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
    <div className="border rounded-lg p-4 gap-4 flex items-center">
      <div>
        {thumbnailUrl ? (
          <div className="h-16 w-16 rounded-lg overflow-hidden border bg-muted">
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-blue-600/10 rounded-lg p-2">
            <Icon className="h-6 w-6 text-blue-600 " />
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <h3
          className="font-semibold text-lg leading-tight pb-1 truncate"
          title={title}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground pb-2">{description}</p>
        <p className="text-xs text-muted-foreground">
          Lorem ipsum &nbsp;•&nbsp;
          {updatedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
