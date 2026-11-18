"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field";
import { Input as UiInput } from "@ui-sdk/react/input";
import { Textarea as UiTextarea } from "@ui-sdk/react/textarea";
import type { ComponentProps, ReactNode } from "react";

export function FieldRow({
  label,
  description,
  error,
  children,
}: {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <Field className="flex flex-col gap-2">
      <FieldLabel className="text-xs font-medium text-studio-muted">{label}</FieldLabel>
      {children}
      {description ? <FieldDescription className="studio-hint">{description}</FieldDescription> : null}
      {error ? <FieldError className="text-xs text-red-400">{error}</FieldError> : null}
    </Field>
  );
}

export function TextField(props: ComponentProps<typeof UiInput>) {
  return <UiInput {...props} className={`studio-control ${props.className ?? ""}`} />;
}

export function TextAreaField(props: ComponentProps<typeof UiTextarea>) {
  return <UiTextarea {...props} className={`studio-control min-h-24 ${props.className ?? ""}`} />;
}
