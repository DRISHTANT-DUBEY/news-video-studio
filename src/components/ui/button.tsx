"use client";

import { Button as UiButton } from "@ui-sdk/react/button";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof UiButton> & { tone?: "primary" | "secondary" | "ghost" };

const tones = {
  primary: "studio-button",
  secondary: "studio-button-secondary",
  ghost: "rounded-lg px-2 py-1 text-sm text-studio-muted hover:text-studio-ink",
};

export function StudioButton({ tone = "secondary", className = "", ...props }: Props) {
  return <UiButton {...props} className={`${tones[tone]} ${className}`.trim()} />;
}
