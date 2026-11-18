"use client";

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@ui-sdk/react/toolbar";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import type { ComponentProps, ReactNode } from "react";

export function StudioToolbar({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Toolbar aria-label={label} className="flex flex-wrap items-center gap-1 rounded-xl border border-studio-line bg-studio-panel px-2 py-1.5">
      {children}
    </Toolbar>
  );
}

export function ToolbarAction({
  className = "",
  ...props
}: ComponentProps<typeof ToolbarButton>) {
  return <ToolbarButton {...props} className={`studio-button-secondary !px-2 !py-1.5 ${className}`} />;
}

export function ToolbarDivider() {
  return <ToolbarSeparator className="mx-1 h-5 w-px bg-studio-line" />;
}

export function ToolbarActions({ children }: { children: ReactNode }) {
  return <ToolbarGroup className="flex items-center gap-1">{children}</ToolbarGroup>;
}

export function StudioTabs({
  label,
  value,
  onValueChange,
  tabs,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  tabs: { value: string; label: string; panel: ReactNode }[];
}) {
  return (
    <Tabs value={value} onValueChange={(next) => next && onValueChange(next)}>
      <TabsList aria-label={label} className="flex flex-wrap gap-1 border-b border-studio-line pb-2">
        {tabs.map((tab) => (
          <TabsTab
            key={tab.value}
            value={tab.value}
            className="rounded-md px-3 py-1.5 text-xs text-studio-muted data-[selected]:bg-studio-accent-soft data-[selected]:text-white"
          >
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsPanel key={tab.value} value={tab.value} className="pt-4">
          {tab.panel}
        </TabsPanel>
      ))}
    </Tabs>
  );
}
