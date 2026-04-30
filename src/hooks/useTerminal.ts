"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { commands } from "@/config/commands";
import { closest } from "fastest-levenshtein";

import type { HistoryItem, CommandOutput } from "@/types/terminal";
import { escapeHtml } from "@/utils/html";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { createCommandHandlers } from "@/config/commandHandlers";

export const useTerminal = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const { commandHistory, addCommand, navigateUp, navigateDown } = useCommandHistory();
  const { isTyping, setIsTyping, currentTypingOutput, typingInterruptRef, typeText } = useTypingAnimation();
  const [showGlobe, setShowGlobe] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const allCommandNames = Object.keys(commands);

  const promptLine1 = `<span class="text-green-400">┌─(</span><span class="text-indigo-500 font-bold">daroh@terminal</span><span class="text-green-400">)-[~/portfolio]</span> <span class="text-yellow-400">(main)</span>`;
  const promptLine2 = `<span class="text-green-400">└─</span><span class="text-indigo-500">$</span>&nbsp;`;

  const commandHandlers = useMemo(
    () => createCommandHandlers({ setShowGlobe, setHistory, showGlobe, commandHistory }),
    [showGlobe, commandHistory]
  );

  const processCommand = useCallback(
    async (command: string, currentHistory: HistoryItem[]) => {
      let output: CommandOutput = "";
      let commandName = command;
      let args: string[] = [];

      if (!commandHandlers[command]) {
        const parts = command.split(" ");
        commandName = parts[0];
        args = parts.slice(1);
      }

      if (commandName === "clear") {
        commandHandlers.clear([]);
        return;
      }

      if (commandHandlers[commandName]) {
        output = commandHandlers[commandName](args);
      } else if (command.trim() !== "") {
        const singleWordCommand = escapeHtml(command.split(" ")[0]);
        const suggestion = closest(command.split(" ")[0], allCommandNames);
        let suggestionText = "";
        if (suggestion) {
          suggestionText = `<br>Did you mean '<span class="text-yellow-400">${escapeHtml(suggestion)}</span>'?`;
        }
        output = `<span class="text-red-400">Command not found: ${singleWordCommand}</span><br>Type 'help' for a list of available commands.${suggestionText}`;
      }

      if (typeof output === "object") {
        setHistory([...currentHistory, output, ""]);
      } else if (typeof output === "string") {
        setHistory(currentHistory);
        await typeText(output, setHistory);
      }
    },
    [allCommandNames, commandHandlers, typeText]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxInputLength = 1000;
    const newInput = e.target.value.slice(0, maxInputLength);
    setInput(newInput);
  };

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle Ctrl+C — only ctrlKey (metaKey is Cmd on Mac, used for native copy)
      if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        e.stopPropagation();
        // Interrupt current typing or command
        typingInterruptRef.current = true; 
        setIsTyping(false);
        const interruptedInput = input ? input : "";
        const newHistory = [
          ...history,
          `${promptLine1}<br>${promptLine2}<span class="text-green-400">${interruptedInput}</span><span class="text-red-400">^C</span>`,
          ""
        ];
        setHistory(newHistory);
        setInput("");
        return;
      }

      // Ctrl+L — clear terminal (same as 'clear' command)
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setHistory([]);
        return;
      }

      // Ctrl+U — clear current input line
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        setInput("");
        return;
      }

      // Ctrl+A — move cursor to start of input
      if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        const inputEl = e.currentTarget;
        inputEl.setSelectionRange(0, 0);
        return;
      }

      // Ctrl+E — move cursor to end of input
      if (e.ctrlKey && (e.key === "e" || e.key === "E")) {
        e.preventDefault();
        const inputEl = e.currentTarget;
        inputEl.setSelectionRange(input.length, input.length);
        return;
      }
      
      if (e.key === "Enter" && !isTyping) {
        // Handle !! — re-execute last command
        let commandToRun = input;
        if (input.trim() === "!!") {
          const lastCmd = commandHistory[commandHistory.length - 1];
          if (!lastCmd) {
            setHistory([...history, `${promptLine1}<br>${promptLine2}<span class="text-green-400">!!</span>`, `<span class="text-red-400">!!: no previous command</span>`, ""]);
            setInput("");
            return;
          }
          commandToRun = lastCmd;
        }

        if (commandToRun.trim() === "") {
          setHistory([...history, `${promptLine1}<br>${promptLine2}`, ""]);
          setInput("");
          return;
        }
        addCommand(commandToRun);
        const newHistory = [
          ...history,
          `${promptLine1}<br>${promptLine2}<span class="text-green-400">${commandToRun}</span>`,
        ];
        processCommand(commandToRun.toLowerCase(), newHistory);
        setInput("");
      } else if (e.key === "Tab") {
        e.preventDefault();
        const currentInput = input.trim();
        if (!currentInput) return;

        const matches = allCommandNames.filter((cmd) =>
          cmd.startsWith(currentInput)
        );

        if (matches.length === 1) {
          setInput(matches[0] + " ");
        } else if (matches.length > 1) {
          const newHistory = [
            ...history,
            `${promptLine1}<br>${promptLine2}${input}`,
            matches.join("\u00A0\u00A0"),
          ];
          setHistory(newHistory);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = navigateUp();
        if (prev !== null) setInput(prev);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = navigateDown();
        if (next !== null) setInput(next);
      }
    },
    [
      addCommand,
      allCommandNames,
      commandHistory,
      history,
      input,
      navigateUp,
      navigateDown,
      isTyping,
      setIsTyping,
      typingInterruptRef,
      processCommand,
      promptLine1,
      promptLine2,
    ]
  );

  const executeCommand = useCallback(
    (command: string) => {
      addCommand(command);
      const newHistory = [
        ...history,
        `${promptLine1}<br>${promptLine2}<span class="text-green-400">${command}</span>`,
      ];
      processCommand(command.toLowerCase(), newHistory);
      setInput("");
    },
    [addCommand, history, processCommand, promptLine1, promptLine2]
  );

  useEffect(() => {
    const initialCommand = "welcome";
    const welcomeMessage =
      "Welcome to my portfolio terminal!<br>Type 'help' to see available commands.";
    const initialHistory: HistoryItem[] = [
      `${promptLine1}<br>${promptLine2}<span class="text-green-400">${initialCommand}</span>`,
      "",
    ];
    setHistory(initialHistory);
    typeText(welcomeMessage, setHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, currentTypingOutput]);

  return {
    history,
    currentTypingOutput,
    input,
    isTyping,
    showGlobe,
    terminalRef,
    promptLine1,
    promptLine2,
    handleInputChange,
    handleInputKeyDown,
    setShowGlobe,
    executeCommand,
  };
}; 
