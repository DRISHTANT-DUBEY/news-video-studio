import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AudioPanel } from "./AudioPanel";
import { MediaLibrary } from "./MediaLibrary";
import { TimelineEditor } from "./TimelineEditor";
import WorkspaceShell from "./WorkspaceShell";

describe("workspace wiring", () => {
  it("offers local media import without implying an upload", () => {
    render(<MediaLibrary />);
    expect(screen.getByText("Import video")).toBeTruthy();
    expect(screen.getByText(/stay on this device/i)).toBeTruthy();
  });

  it("labels unimplemented recording honestly", () => {
    render(<AudioPanel />);
    const record = screen.getByRole("button", { name: /record voice-over/i });
    expect(record).toHaveProperty("disabled", true);
  });

  it("renders timeline clips from the primitive state", () => {
    render(<TimelineEditor />);
    expect(screen.getByText("Sample footage — import to replace")).toBeTruthy();
    expect(screen.getByText("Footage")).toBeTruthy();
    expect(screen.getByLabelText("Multi-track timeline")).toBeTruthy();
  });

  it("renders the whole workspace with a stable layout on first paint", () => {
    render(<WorkspaceShell />);
    expect(screen.getByRole("heading", { name: "NewsForge Studio" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Project name" })).toBeTruthy();
  });
});
