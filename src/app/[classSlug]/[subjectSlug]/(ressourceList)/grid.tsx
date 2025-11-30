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
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { Prisma } from "@/generated/client";
import Fuse from "fuse.js";
import { BookOpen, FileText, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import RessourceCard from "../ressource-card";
import UploadRessourceDialog from "../upload-dialog";

export default function RessourceGrid({
  subject,
  tagCategories,
  allowed,
}: {
  subject: Prisma.SubjectGetPayload<{
    include: { ressources: { include: { tags: true } }; class: true };
  }>;
  tagCategories: Prisma.TagCategoryGetPayload<{
    include: { tags: true };
  }>[];
  allowed: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const handleTagChange = useCallback(
    (categoryTags: Option[], categoryId: string) => {
      setSelectedTagIds((prev) => {
        const currentTags = new Set(prev);

        // Remove all tags belonging to this category from the current selection
        const categoryTagIds =
          tagCategories
            .find((c) => c.id === categoryId)
            ?.tags.map((t) => t.id) || [];

        categoryTagIds.forEach((id) => currentTags.delete(id));

        // Add the newly selected tags
        categoryTags.forEach((tag) => currentTags.add(tag.value));

        return Array.from(currentTags);
      });
    },
    [tagCategories]
  );

  // Filter resources based on tags
  const filteredRessources = useMemo(() => {
    if (selectedTagIds.length === 0) return subject.ressources;

    // Group selected tags by category
    const selectedTagsByCategory: Record<string, string[]> = {};

    tagCategories.forEach((category) => {
      const categorySelectedTags = category.tags
        .filter((tag) => selectedTagIds.includes(tag.id))
        .map((tag) => tag.id);

      if (categorySelectedTags.length > 0) {
        selectedTagsByCategory[category.id] = categorySelectedTags;
      }
    });

    return subject.ressources.filter((ressource) => {
      // Check if resource matches ALL active categories (AND logic across categories)
      return Object.values(selectedTagsByCategory).every((categoryTags) => {
        // Check if resource has AT LEAST ONE tag from this category (OR logic within category)
        return ressource.tags.some((tag) => categoryTags.includes(tag.id));
      });
    });
  }, [subject.ressources, selectedTagIds, tagCategories]);

  const fuse = useMemo(() => {
    return new Fuse(filteredRessources, {
      keys: ["title", "description"],
      threshold: 0.35,
      includeScore: true,
    });
  }, [filteredRessources]);

  if (subject.ressources.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>
          <EmptyTitle>Aucune ressource disponible pour le moment 😴</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          {allowed && <UploadRessourceDialog subject={subject} />}
        </EmptyContent>
      </Empty>
    );
  }

  const results = query
    ? fuse.search(query).map((result) => result.item)
    : filteredRessources;

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
              value={category.tags
                .filter((tag) => selectedTagIds.includes(tag.id))
                .map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
              onChange={(options) => handleTagChange(options, category.id)}
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
      <div className="grid grid-cols-4 gap-4">
        {results.map((ressource) => (
          <RessourceCard
            key={ressource.id}
            title={ressource.title}
            description={ressource.description}
            updatedAt={ressource.updatedAt}
            Icon={FileText}
            fileUrl={ressource.fileUrl}
            thumbnailUrl={ressource.thumbnailUrl}
          />
        ))}
      </div>
    </>
  );
}
