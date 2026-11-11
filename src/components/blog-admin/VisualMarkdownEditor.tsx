"use client";

import { useEffect, useRef, useState } from "react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

import { checkMarkdownRoundtrip } from "@/lib/blog-editor-roundtrip";

interface Props {
  value: string;
  onChange: (markdown: string) => void;
  onStageAsset: (file: File) => Promise<string>;
}

export function VisualMarkdownEditor({ value, onChange, onStageAsset }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const initial = useRef(value);
  const change = useRef(onChange);
  const stage = useRef(onStageAsset);
  const [mode, setMode] = useState<"visual" | "source">("visual");
  const [reason, setReason] = useState("");
  const [ready, setReady] = useState(false);

  change.current = onChange;
  stage.current = onStageAsset;

  useEffect(() => {
    let active = true;
    let created = false;
    let instance: { destroy: () => void } | undefined;

    async function setup() {
      try {
        const { Crepe } = await import("@milkdown/crepe");
        if (!active || !root.current) return;
        const crepe = new Crepe({
          root: root.current,
          defaultValue: initial.current,
          features: { [Crepe.Feature.Latex]: false },
          featureConfigs: {
            [Crepe.Feature.ImageBlock]: {
              onUpload: (file) => stage.current(file),
            },
          },
        });
        instance = crepe;
        crepe.on((listener) =>
          listener.markdownUpdated((_ctx, markdown) => {
            if (!created) return;
            const result = checkMarkdownRoundtrip(markdown, markdown);
            if (!result.safe) {
              setReason(result.reason ?? "Markdown incompatível");
              setMode("source");
            }
            change.current(markdown);
          })
        );
        await crepe.create();
        if (!active) return;
        const result = checkMarkdownRoundtrip(
          initial.current,
          crepe.getMarkdown()
        );
        if (!result.safe) {
          setReason(result.reason ?? "Markdown incompatível");
          setMode("source");
        }
        created = true;
        setReady(true);
      } catch {
        if (active) {
          setReason("Editor visual indisponível; use o Markdown.");
          setMode("source");
          setReady(true);
        }
      }
    }

    setup();
    return () => {
      active = false;
      instance?.destroy();
    };
  }, []);

  return (
    <div className="blog-visual-editor">
      <div
        className="blog-editor-tabs flex items-center justify-between"
        role="tablist"
        aria-label="Modo de edição"
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "visual"}
            disabled={!ready || !!reason}
            onClick={() => setMode("visual")}
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5" aria-hidden="true"></i>
            Visual (WYSIWYG · Milkdown Crepe)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "source"}
            onClick={() => setMode("source")}
          >
            <i className="fa-brands fa-markdown mr-1.5" aria-hidden="true"></i>
            Markdown (Código-fonte)
          </button>
        </div>
        <span className="text-xs text-stone-500 hidden sm:inline">
          Digite <code className="bg-orange-50 text-orange-800 px-1.5 py-0.5 rounded font-mono">/</code> no editor visual para abrir o menu de blocos (títulos, listas, imagens, citações, tabelas)
        </span>
      </div>
      {reason && (
        <p
          role="status"
          className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-medium text-amber-800"
        >
          {reason}
        </p>
      )}
      <div
        ref={root}
        hidden={mode !== "visual"}
        aria-label="Editor visual do artigo"
      />
      {mode === "source" && (
        <textarea
          aria-label="Markdown do artigo"
          value={value}
          onChange={(event) => {
            setReason(
              "Clique em 'Recarregar no Editor Visual' ou reabra o artigo para sincronizar o modo visual após editar o Markdown bruto."
            );
            change.current(event.target.value);
          }}
          rows={22}
          spellCheck
        />
      )}
    </div>
  );
}
