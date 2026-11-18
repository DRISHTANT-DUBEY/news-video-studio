import {
  createChange,
  createSpans,
  definePrimitive,
  type ChangeDetails,
  type SpansDraft,
  type SpansReason,
} from "@ui-sdk/core";
import type { Clip } from "@/lib/types";

export type TimelineOptions = {
  clips?: Clip[];
  defaultClips?: Clip[];
  tracks?: string[];
  lockedTracks?: string[];
  durationFrames?: number;
  onClipsChange?: (clips: Clip[], details: ChangeDetails<SpansReason>) => void;
};

type TimelineState = {
  clips: Clip[];
  draft: SpansDraft<Clip> | null;
};

const timeline = definePrimitive({
  name: "news-timeline",
  options: {
    clips: "value",
    defaultClips: "value",
    tracks: "list",
    lockedTracks: "list",
    durationFrames: "number",
    onClipsChange: "callback",
  },
  controlled: ["clips"],
  state: (options: TimelineOptions): TimelineState => ({
    clips: options.clips ?? options.defaultClips ?? [],
    draft: null,
  }),
  sync: (options: TimelineOptions) =>
    options.clips === undefined ? {} : { clips: options.clips },
  api: (context) => {
    const change = createChange(context);
    let created = 0;

    const spans = createSpans<TimelineState, Clip>(context, {
      key: "clips",
      draft: "draft",
      set: (value, details) => change("clips", value, details),
      axis: "x",
      min: () => 0,
      max: () => context.options().durationFrames ?? 900,
      step: () => 1,
      overlap: false,
      tracks: () => context.options().tracks ?? [],
      disabled: (clip) =>
        context.options().lockedTracks?.includes(clip.track) ?? false,
      create: (span) => ({
        ...span,
        id: `clip-new-${(created += 1)}`,
        sourceIn: 0,
        label: "New clip",
        gain: 1,
        muted: false,
      }),
      label: (clip) => clip.label,
    });

    const findClip = (id: string) =>
      context.store.get().clips.find((clip) => clip.id === id);

    return {
      spans,
      update(id: string, patch: Partial<Clip>) {
        return spans.update(id, patch);
      },
      remove(id: string) {
        return spans.remove(id);
      },
      split(id: string, atFrame: number) {
        const clip = findClip(id);
        if (!clip || atFrame <= clip.start || atFrame >= clip.end) return false;
        const next: Clip = {
          ...clip,
          id: `${clip.id}-split-${atFrame}`,
          start: atFrame,
          sourceIn: clip.sourceIn + (atFrame - clip.start),
        };
        const clips = context.store.get().clips;
        return change(
          "clips",
          [
            ...clips.map((item) =>
              item.id === id ? { ...item, end: atFrame } : item,
            ),
            next,
          ],
          { reason: "imperative" },
        );
      },
    };
  },
  slots: (slot) => ({
    root: slot<{}, { clips: Clip[] }>({
      state: (state) => ({ clips: state.draft?.spans ?? state.clips }),
      attrs: () => ({ role: "group" }),
    }),
    track: slot<{ value: string }>({
      props: { value: "string" },
      bind: (el, part) => part.api.spans.bindTrack(el, part.key),
      on: {
        pointerdown: (event, part) =>
          part.api.spans.trackPointerdown(event as PointerEvent, part.key),
      },
    }),
    clip: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => {
        const clip = part.api.spans.spans(state).find((item) => item.id === part.key);
        if (!clip) return { "data-span-id": part.key, tabindex: "-1" };
        return {
          ...part.api.spans.spanAttrs(state, part.key),
          style: part.api.spans.spanStyle(clip),
          tabindex: "0",
          "aria-label": clip.label,
        };
      },
      bind: (el, part) => part.api.spans.bindSpan(el, part.key),
      on: {
        pointerdown: (event, part) =>
          part.api.spans.spanPointerdown(event as PointerEvent, part.key),
        keydown: (event, part) =>
          part.api.spans.keydown(event as KeyboardEvent, part.key),
      },
    }),
    handle: slot<{ edge: string }>({
      props: { edge: "string" },
      attrs: (_state, part) => ({ "data-span-edge": part.props.edge }),
    }),
  }),
  agent: { actions: ["update", "remove", "split"] },
});

export { timeline };
