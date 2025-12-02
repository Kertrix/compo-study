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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperclipIcon, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const RessourceSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre doit contenir au plus 100 caractères"),
  description: z
    .string()
    .min(3, "La description doit contenir au moins 3 caractères")
    .max(1000, "La description doit contenir au plus 1000 caractères"),
  files: z.array(z.instanceof(File)).optional(),
});

export default function NewRessourceForm() {
  const form = useForm<z.infer<typeof RessourceSchema>>({
    resolver: zodResolver(RessourceSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  const [files, setFiles] = useState<File[]>([]);

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

  function onSubmit(data: z.infer<typeof RessourceSchema>) {
    // Do something with the form values.
    console.log(data);
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
        }}
        aria-label="Remove file"
      >
        <XIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  ));

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-4 border rounded-lg"
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ressource-title">Titre</FieldLabel>
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
                Description
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
              <FieldLabel htmlFor="ressource-files">Fichiers</FieldLabel>
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
                  <p className="mb-1.5 text-sm font-medium">Upload file</p>
                  <input
                    {...getInputProps()}
                    id="file-upload-dialog"
                    name="files"
                    type="file"
                    className="sr-only"
                    disabled={files.length >= 1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse (max 1 file)
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
            Créer
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
