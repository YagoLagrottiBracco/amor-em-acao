"use client";

import React, { useEffect, useRef, useState } from "react";

const SPEEDS = [1, 1.25, 1.5];
const READING = "speech-reading";

function readableBlocks(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll<HTMLElement>("h2, h3, p, li, blockquote"),
  ].filter(
    (element) =>
      !element.closest("pre, table, figure") &&
      !element.querySelector("p, li") &&
      element.innerText.trim()
  );
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const language = lang.split("-")[0];
  return (
    voices.find((voice) => voice.lang === lang && voice.localService) ??
    voices.find((voice) => voice.lang === lang) ??
    voices.find((voice) => voice.lang.startsWith(language))
  );
}

export function ListenToArticle({
  title,
  targetId,
}: {
  title: string;
  targetId: string;
}) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [speed, setSpeed] = useState(1);
  const queue = useRef<{ blocks: HTMLElement[]; position: number }>({
    blocks: [],
    position: 0,
  });
  const speedRef = useRef(1);

  useEffect(
    () =>
      setSupported(
        "speechSynthesis" in window &&
          typeof SpeechSynthesisUtterance === "function"
      ),
    []
  );

  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      document
        .querySelectorAll(`.${READING}`)
        .forEach((element) => element.classList.remove(READING));
    },
    []
  );

  function highlight(element: HTMLElement | undefined) {
    document
      .querySelectorAll(`.${READING}`)
      .forEach((other) => other.classList.remove(READING));
    if (!element) return;
    element.classList.add(READING);
    const { top, bottom } = element.getBoundingClientRect();
    if (top < 80 || bottom > window.innerHeight) {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function speakFrom(position: number) {
    const { blocks } = queue.current;
    queue.current.position = position;
    if (position >= blocks.length) {
      highlight(undefined);
      setState("idle");
      return;
    }
    const block = blocks[position];
    const utterance = new SpeechSynthesisUtterance(
      position === 0 ? `${title}. ${block.innerText}` : block.innerText
    );
    utterance.lang = "pt-BR";
    utterance.voice = pickVoice("pt-BR") ?? null;
    utterance.rate = speedRef.current;
    utterance.onstart = () => highlight(block);
    utterance.onend = () => {
      if (queue.current.position === position) speakFrom(position + 1);
    };
    window.speechSynthesis.speak(utterance);
  }

  function start() {
    const root = document.getElementById(targetId);
    if (!root) return;
    window.speechSynthesis.cancel();
    queue.current = { blocks: readableBlocks(root), position: 0 };
    setState("playing");
    speakFrom(0);
  }

  function stop() {
    queue.current.position = Number.POSITIVE_INFINITY;
    window.speechSynthesis.cancel();
    highlight(undefined);
    setState("idle");
  }

  function changeSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    speedRef.current = next;
    if (state === "playing") {
      const { position } = queue.current;
      queue.current.position = -1;
      window.speechSynthesis.cancel();
      speakFrom(position);
    }
  }

  if (!supported) return null;
  const button =
    "inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-800";

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      {state === "idle" ? (
        <button
          type="button"
          onClick={start}
          title="Síntese de voz do navegador"
          className={button}
        >
          <i className="fa-solid fa-headphones text-orange-600" aria-hidden="true"></i>
          Ouvir este artigo
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              if (state === "playing") {
                window.speechSynthesis.pause();
                setState("paused");
              } else {
                window.speechSynthesis.resume();
                setState("playing");
              }
            }}
            className={button}
          >
            <i
              className={`fa-solid ${
                state === "playing" ? "fa-pause" : "fa-play"
              } text-orange-600`}
              aria-hidden="true"
            ></i>
            {state === "playing" ? "Pausar" : "Continuar"}
          </button>
          <button type="button" onClick={stop} className={button}>
            <i className="fa-solid fa-stop text-red-600" aria-hidden="true"></i>
            Parar
          </button>
        </>
      )}
      <button
        type="button"
        onClick={changeSpeed}
        aria-label={`Velocidade: ${speed}×`}
        className={button}
      >
        <i className="fa-solid fa-gauge-high text-orange-600" aria-hidden="true"></i>
        {speed}×
      </button>
    </div>
  );
}
