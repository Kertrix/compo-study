"use client";

import { PaperclipIcon, UploadIcon, XIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uploadAction } from "./upload-action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Prisma } from "@/generated/client";
import { cn } from "@/lib/utils";

import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function UploadRessourceDialog({
  subject,
}: {
  subject: Prisma.SubjectGetPayload<{ include: { class: true } }>;
}) {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles.slice(0, 1)),
    multiple: false,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

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
        onClick={() =>
          setFiles((prev) =>
            prev.filter((prevFile) => prevFile.name !== file.name)
          )
        }
        aria-label="Remove file"
      >
        <XIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  ));

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    const form = new FormData();

    for (const f of files) {
      form.append("files", f);
      if (f.type === "application/pdf") {
        const thumbnail = await generateThumbnail(f);
        if (thumbnail) {
          form.append("thumbnail", thumbnail);
        }
      }
    }

    await uploadAction(form, subject)
      .then(() => {
        setOpen(false);
        setFiles([]);
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setFiles([]);
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Uploader une ressource</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle className="border-b px-6 py-4 text-base">
            Uploader une nouvelle ressource
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <div
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
            </div>
            {files.length > 0 && <>{filesList}</>}
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? "Téléversement..." : "Téléverser"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
