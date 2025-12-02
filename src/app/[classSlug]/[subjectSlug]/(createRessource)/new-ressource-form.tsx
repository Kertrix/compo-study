"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Prisma } from "@/generated/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperclipIcon, UploadIcon, XIcon } from "lucide-react";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { uploadAction } from "../upload-action";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

const generateThumbnail = async (file: File): Promise<File | null> => {
  if (file.type !== "application/pdf") return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return null;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas,
    } as any).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "thumbnail.png", { type: "image/png" }));
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return null;
  }
};

export const RessourceSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  files: z.array(z.instanceof(File)).min(1, "Un fichier est requis"),
  thumbnail: z.instanceof(File).optional(),
});

export default function NewRessourceForm({
  subject,
}: {
  subject: Prisma.SubjectGetPayload<{ include: { class: true } }>;
}) {
  const form = useForm<z.infer<typeof RessourceSchema>>({
    resolver: zodResolver(RessourceSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.slice(0, 1));
      form.setValue("files", acceptedFiles.slice(0, 1), {
        shouldValidate: true,
      });
    },
    multiple: false,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  async function onSubmit(data: z.infer<typeof RessourceSchema>) {
    setIsUploading(true);

    if (files[0].type === "application/pdf") {
      const thumbnail = await generateThumbnail(files[0]);
      if (thumbnail) {
        data.thumbnail = thumbnail;
      }
    }

    await uploadAction(data, subject)
      .then(() => {
        setFiles([]);
      })
      .finally(() => setIsUploading(false));
  }

  const filesList = files.map((file) => (
    <div
      key={file.name}
      className="w-full flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
    >
      <div className="flex items-center gap-3">
        <PaperclipIcon
          className="size-4 shrink-0 opacity-60"
          aria-hidden="true"
        />
        <div className="min-w-0 max-w-full">
          <p
            className="truncate text-wrap text-[13px] font-medium"
            title={file.name}
          >
            {file.name}
          </p>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground shrink-0"
        onClick={() => {
          const newFiles = files.filter(
            (prevFile) => prevFile.name !== file.name
          );
          form.setValue("files", newFiles, { shouldValidate: true });
          setFiles(newFiles);
        }}
        aria-label="Remove file"
      >
        <XIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  ));

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ressource-title">
                Titre (facultatif)
              </FieldLabel>
              <Input
                {...field}
                id="ressource-title"
                aria-invalid={fieldState.invalid}
                placeholder="Chapitre 1..."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ressource-description">
                Description (facultatif)
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="ressource-description"
                  placeholder="Description de la ressource..."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field?.value?.length}/1000 caractères
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="files"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ressource-files">Fichier</FieldLabel>
              <div
                {...field}
                {...getRootProps()}
                className={cn(
                  isDragActive
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border",
                  "flex justify-center rounded-md border border-dashed px-6 py-12 transition-colors duration-200",
                  files.length >= 1 ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div
                    className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                    aria-hidden="true"
                  >
                    <UploadIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">
                    Uploader un fichier
                  </p>
                  <input
                    {...getInputProps()}
                    id="file-upload-dialog"
                    name="files"
                    type="file"
                    className="sr-only"
                    disabled={files.length >= 1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Glissez & déposez ou cliquez pour sélectionner (max 1
                    fichier)
                  </p>
                </div>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              {files.length > 0 && <>{filesList}</>}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button className="w-full cursor-pointer" type="submit">
            {isUploading ? "En cours..." : "Créer"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
