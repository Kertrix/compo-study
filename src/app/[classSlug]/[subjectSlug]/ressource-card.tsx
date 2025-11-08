import { LucideIcon } from "lucide-react";

export default function RessourceCard({
  title,
  description,
  resourceType,
  updatedAt,
  Icon,
}: {
  title: string;
  description: string | null;
  resourceType: string;
  updatedAt: Date;
  Icon: LucideIcon;
}) {
  return (
    <div className="border rounded-lg p-4 gap-4 flex items-center">
      <div>
        <div className="bg-blue-600/10 rounded-lg p-2">
          <Icon className="h-6 w-6 text-blue-600 " />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground pb-2">{description}</p>
        <p className="text-xs text-muted-foreground">
          {resourceType}&nbsp;•&nbsp;
          {updatedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
