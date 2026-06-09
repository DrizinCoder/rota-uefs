"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  words: string[];
  /** Classes no container externo; o padrão é uma linha contínua, centralizada. */
  className?: string;
  /** Permite quebra de linha (útil para subtítulos em telas estreitas). */
  allowWrap?: boolean;
  speed?: number;
  delayBetweenWords?: number;
  cursor?: boolean;
  cursorChar?: string;
}

export function Typewriter({
  words,
  className,
  allowWrap = false,
  speed = 100,
  delayBetweenWords = 2000,
  cursor = true,
  cursorChar = "|",
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const currentWord = words[wordIndex] ?? "";

  useEffect(() => {
    let nestedTimeout: ReturnType<typeof setTimeout> | undefined;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentWord.length) {
          setDisplayText(currentWord.substring(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          nestedTimeout = setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      } else if (charIndex > 0) {
        setDisplayText(currentWord.substring(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (words.length ? (prev + 1) % words.length : 0));
      }
    }, isDeleting ? speed / 2 : speed);

    return () => {
      clearTimeout(timeout);
      if (nestedTimeout) clearTimeout(nestedTimeout);
    };
  }, [charIndex, currentWord, delayBetweenWords, isDeleting, speed, wordIndex, words]);

  useEffect(() => {
    if (!cursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [cursor]);

  return (
    <div
      className={cn(
        "flex w-full justify-center overflow-x-visible overflow-y-visible",
        allowWrap && "text-pretty text-center",
        className,
      )}
    >
      <span
        className={cn(
          allowWrap ? "inline hyphens-auto break-words" : "inline-block whitespace-nowrap",
        )}
      >
        {displayText}
        {cursor && (
          <span
            className="ml-1 transition-opacity duration-75"
            style={{ opacity: showCursor ? 1 : 0 }}
          >
            {cursorChar}
          </span>
        )}
      </span>
    </div>
  );
}
