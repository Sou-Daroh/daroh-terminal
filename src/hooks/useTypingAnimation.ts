"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { HistoryItem } from "@/types/terminal";

export const useTypingAnimation = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingOutput, setCurrentTypingOutput] = useState<string | null>(null);
  const isTypingRef = useRef(isTyping);
  const typingInterruptRef = useRef(false);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        isTypingRef.current &&
        e.ctrlKey &&
        (e.key.toLowerCase() === "c")
      ) {
        e.preventDefault();
        e.stopPropagation();
        typingInterruptRef.current = true;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const typeText = useCallback(
    async (
      text: string,
      setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>
    ) => {
      setIsTyping(true);
      typingInterruptRef.current = false;
      setCurrentTypingOutput("");

      await new Promise((res) => setTimeout(res, 50));

      let typedOutput = "";
      const typingDelay = 0;

      for (let i = 0; i < text.length; i++) {
        if (typingInterruptRef.current) {
          // Commit the interrupted output + ^C marker to history
          setHistory((prevHistory) => [
            ...prevHistory,
            typedOutput + '<span class="text-red-400">^C</span>',
            "",
          ]);
          setCurrentTypingOutput(null);
          setIsTyping(false);
          return;
        }

        const tagMatch = text.substring(i).match(/^<[^>]+>/);
        const entityMatch = text.substring(i).match(/^&[a-zA-Z0-9#]+;/);

        if (tagMatch) {
          const tag = tagMatch[0];
          typedOutput += tag;
          i += tag.length - 1;
        } else if (entityMatch) {
          const entity = entityMatch[0];
          typedOutput += entity;
          i += entity.length - 1;
        } else {
          typedOutput += text[i];
        }

        // Update only the isolated typing output state — history stays untouched
        setCurrentTypingOutput(typedOutput);

        if (i < text.length - 1) {
          await new Promise((res) => setTimeout(res, typingDelay));
        }
      }

      // Typing complete: commit the final output to history and clear typing state
      setHistory((prevHistory) => [...prevHistory, typedOutput, ""]);
      setCurrentTypingOutput(null);
      setIsTyping(false);
    },
    []
  );

  return {
    isTyping,
    setIsTyping,
    currentTypingOutput,
    setCurrentTypingOutput,
    typingInterruptRef,
    typeText,
  };
};
