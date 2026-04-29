"use client";

import { useState, useCallback } from "react";

export const useCommandHistory = () => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addCommand = useCallback((command: string) => {
    setCommandHistory((prev) => {
      const next = [...prev, command];
      setHistoryIndex(next.length);
      return next;
    });
  }, []);

  const navigateUp = useCallback((): string | null => {
    if (commandHistory.length === 0) return null;
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return commandHistory[newIndex];
    }
    const newIndex = commandHistory.length - 1;
    setHistoryIndex(newIndex);
    return commandHistory[newIndex];
  }, [commandHistory, historyIndex]);

  const navigateDown = useCallback((): string | null => {
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return commandHistory[newIndex];
    }
    setHistoryIndex(commandHistory.length);
    return "";
  }, [commandHistory, historyIndex]);

  return {
    commandHistory,
    addCommand,
    navigateUp,
    navigateDown,
  };
};
