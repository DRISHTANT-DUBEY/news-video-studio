"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import type { ReactNode } from "react";

export function StudioDialog({
  open,
  onOpenChange,
  title,
  description,
  triggerLabel,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  triggerLabel: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="studio-button-secondary">{triggerLabel}</DialogTrigger>
      <DialogBackdrop className="fixed inset-0 z-40 bg-black/60" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-studio-line bg-studio-panel p-6 shadow-2xl">
        <div className="mb-5 flex flex-col gap-2">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="studio-hint">{description}</DialogDescription>
        </div>
        {children}
        <div className="mt-6 flex justify-end">
          <DialogClose className="studio-button">Close</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
