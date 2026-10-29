"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { MusicToggle } from "@/components/ui/MusicToggle";

type Props = {
  cover: ReactNode;
  children: ReactNode;
  musicSrc: string | null;
};

/**
 * Mengunci halaman sampai "Buka undangan" ditekan, lalu menjalankan satu momen
 * gerak (cover terangkat 600ms) dan memulai musik. Menghormati reduced motion.
 */
export function InvitationShell({ cover, children, musicSrc }: Props) {
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }

  function open() {
    if (opened || closing) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setOpened(true);
      startAudio();
      return;
    }

    setClosing(true);
    window.setTimeout(() => {
      setOpened(true);
      startAudio();
    }, 600);
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    audio.pause();
    setPlaying(false);
  }

  return (
    <>
      <div className={opened ? undefined : "h-dvh overflow-hidden"}>{children}</div>

      {!opened ? (
        <div
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("[data-open-invitation]")) open();
          }}
          className={`fixed inset-0 z-40 transition-all duration-[600ms] ease-out ${
            closing ? "pointer-events-none -translate-y-8 opacity-0" : ""
          }`}
        >
          {cover}
        </div>
      ) : null}

      {musicSrc ? <audio ref={audioRef} src={musicSrc} loop preload="none" /> : null}

      {opened && musicSrc ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto flex w-full max-w-[430px] px-5">
          <div className="pointer-events-auto">
            <MusicToggle playing={playing} onClick={toggleMusic} />
          </div>
        </div>
      ) : null}
    </>
  );
}
