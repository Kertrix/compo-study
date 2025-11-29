"use client";

import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multi-select";
import { Prisma } from "@/generated/client";
import Fuse from "fuse.js";
import { BookOpen, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import RessourceCard from "../ressource-card";
import UploadRessourceDialog from "../upload-dialog";

export default function RessourceGrid({
  subject,
  tagCategories,
}: {
  subject: Prisma.SubjectGetPayload<{
    include: { ressources: true; class: true };
  }>;
  tagCategories: Prisma.TagCategoryGetPayload<{
    include: { tags: true };
  }>[];
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
      <div className="grid grid-cols-5 gap-2 mb-2">
        <div className="space-y-2 col-span-2">
          <Label>Rechercher par nom</Label>
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Rechercher une ressource..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </div>
        {tagCategories.map((category) => (
          <div className="space-y-2 col-span-1" key={category.id}>
            <Label>{category.name}</Label>
            <MultipleSelector
              commandProps={{
                label: "Select " + category.name,
              }}
              // value={tags.map((tag) => ({     TODO: add url params
              //   value: tag.id,
              //   label: tag.name,
              // }))}
              defaultOptions={category.tags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              placeholder={"Selectionnez... "}
              hidePlaceholderWhenSelected
              emptyIndicator={
                <p className="text-center text-sm">Aucun tag trouvé</p>
              }
              className="w-full"
            />
          </div>
        ))}
      </div>
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
