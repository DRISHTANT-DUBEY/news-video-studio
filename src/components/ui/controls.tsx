"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack, SliderValue } from "@ui-sdk/react/slider";
import type { ComponentProps } from "react";
import { FieldRow } from "./field";

export function SelectField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <FieldRow label={label}>
      <Select value={value} onValueChange={(next) => next && onValueChange?.(next)} items={options}>
        <SelectTrigger className="studio-control flex justify-between">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-50 max-h-64 min-w-[var(--anchor-width)] overflow-auto rounded-lg border border-studio-line bg-studio-panel p-1 shadow-xl">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-default rounded px-3 py-2 text-sm data-[highlighted]:bg-studio-panel-alt">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldRow>
  );
}

type SliderProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  format?: ComponentProps<typeof Slider>["format"];
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
};

export function SliderField({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  format,
  onValueChange,
  onValueCommit,
}: SliderProps) {
  return (
    <FieldRow label={label}>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        format={format}
        onValueChange={(next) => typeof next === "number" && onValueChange?.(next)}
        onValueCommit={(next) => typeof next === "number" && onValueCommit?.(next)}
      >
        <div className="flex items-center justify-between gap-3">
          <SliderControl className="flex h-6 flex-1 items-center">
            <SliderTrack className="h-1.5 w-full rounded-full bg-studio-line">
              <SliderIndicator className="h-full rounded-full bg-studio-accent" />
              <SliderThumb className="size-3.5 rounded-full border-2 border-white bg-studio-accent" />
            </SliderTrack>
          </SliderControl>
          <SliderValue className="w-12 text-right text-xs tabular-nums text-studio-muted" />
        </div>
      </Slider>
    </FieldRow>
  );
}
