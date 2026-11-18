"use client";

import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { FieldRow, TextField } from "@/components/ui/field";
import { StatusNote } from "@/components/ui/panel";
import { useEditorStore } from "@/stores/editor-store";

export function BrandPanel() {
  const brand = useEditorStore((state) => state.brand);
  const setBrand = useEditorStore((state) => state.setBrand);
  const commitHistory = useEditorStore((state) => state.commitHistory);

  return (
    <div className="flex flex-col gap-4">
      <FieldRow label="Channel name">
        <TextField value={brand.channelName} onChange={(event) => setBrand({ channelName: event.target.value })} onBlur={commitHistory} />
      </FieldRow>
      <FieldRow label="Primary color">
        <TextField
          value={brand.primaryColor}
          onChange={(event) => setBrand({ primaryColor: event.target.value })}
          onBlur={commitHistory}
        />
      </FieldRow>
      <FieldRow label="Ticker background">
        <TextField
          value={brand.tickerBackground}
          onChange={(event) => setBrand({ tickerBackground: event.target.value })}
          onBlur={commitHistory}
        />
      </FieldRow>
      <FieldRow label="Watermark">
        <Switch
          checked={brand.showWatermark}
          onCheckedChange={(checked) => {
            setBrand({ showWatermark: checked === true });
            commitHistory();
          }}
        >
          <SwitchThumb />
        </Switch>
      </FieldRow>
      <StatusNote>
        Brand values are stored in the project snapshot. Logo, intro and outro asset binding is planned for the render milestone.
      </StatusNote>
    </div>
  );
}
