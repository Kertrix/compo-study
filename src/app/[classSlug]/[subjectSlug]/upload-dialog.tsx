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
import { cn } from "@/lib/utils";

export default function UploadRessourceDialog() {
  const [files, setFiles] = React.useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles([...files, ...acceptedFiles]),
  });

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

    const form = new FormData();
    files.forEach((f) => form.append("files", f));

    await uploadAction(form);
  };

  return (
    <Dialog>
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
                  "flex justify-center rounded-md border border-dashed px-6 py-12 transition-colors duration-200"
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
                    multiple
                  />
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse (max. 50)
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
              >
                Annuler
              </Button>
              <Button type="submit" disabled={files.length === 0}>
                Téléverser
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
