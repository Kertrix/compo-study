"use client";

import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Prisma } from "@/generated/client";
import Fuse from "fuse.js";
import { BookOpen, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import RessourceCard from "../ressource-card";
import UploadRessourceDialog from "../upload-dialog";

export default function RessourceGrid({
  subject,
}: {
  subject: Prisma.SubjectGetPayload<{
    include: { ressources: true; class: true };
  }>;
}) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(subject.ressources, {
      keys: ["title", "description"],
      threshold: 0.35,
      includeScore: true,
    });
  }, [subject.ressources]);

  if (subject.ressources.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>
          <EmptyTitle>Aucun cours disponible pour le moment 😴</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <UploadRessourceDialog subject={subject} />
        </EmptyContent>
      </Empty>
    );
  }

  const results = query
    ? fuse.search(query).map((result) => result.item)
    : subject.ressources;

  return (
    <>
      <Input
        placeholder="Rechercher une ressource..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />

      <div className="grid grid-cols-3 gap-4">
        {results.map((ressource) => (
          <RessourceCard
            key={ressource.id}
            title={ressource.title}
            description={ressource.description}
            updatedAt={ressource.updatedAt}
            Icon={FileText}
          />
        ))}
      </div>
    </>
  );
}
