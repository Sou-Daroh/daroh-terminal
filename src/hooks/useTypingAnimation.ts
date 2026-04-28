"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { HistoryItem } from "@/types/terminal";

export const useTypingAnimation = () => {
  const [isTyping, setIsTyping] = useState(false);
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

      await new Promise((res) => setTimeout(res, 50));

      let typedOutput = "";
      const typingDelay = 0;

      for (let i = 0; i < text.length; i++) {
        if (typingInterruptRef.current) {
          setHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            const lastLine = newHistory[newHistory.length - 1];
            if (typeof lastLine === "string") {
              newHistory[newHistory.length - 1] =
                lastLine + '<span class="text-red-400">^C</span>';
            }
            newHistory.push("");
            return newHistory;
          });
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

        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[newHistory.length - 1] = typedOutput;
          return newHistory;
        });

        if (i < text.length - 1) {
          await new Promise((res) => setTimeout(res, typingDelay));
        }
      }

      setHistory((prevHistory) => [...prevHistory, ""]);
      setIsTyping(false);
    },
    []
  );

  return {
    isTyping,
    setIsTyping,
    typingInterruptRef,
    typeText,
  };
};
