"use client";

import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaCopy, FaCheck } from "react-icons/fa";
import { useTerminal } from "@/hooks/useTerminal";
import { commandList } from "@/config/commands";
import { Command } from "@/config/commands";
import TerminalOutput from "./TerminalOutput";
import type { HistoryItem } from "@/types/terminal";

const CommandButton = ({ command, onClick }: { command: Command; onClick: (cmd: string) => void }) => (
  <button
    className="text-green-400 mx-1 my-1 text-xs md:text-xs lg:text-sm hover:bg-green-500 hover:text-black cursor-pointer px-2 py-1 rounded border border-green-600 md:border-none md:px-1 md:py-0 touch-manipulation"
    onClick={() => onClick(command.name)}
  >
    {command.icon && <span className="mr-1">{command.icon}</span>}
    {command.name}
  </button>
);

const TerminalHeader = ({ executeCommand }: { executeCommand: (cmd: string) => void }) => (
  <div className="bg-black p-2 text-center flex-shrink-0 border-b border-green-800">
    <div className="mt-2 flex items-center justify-center flex-wrap gap-1 md:gap-0">
      {commandList.map((cmd, index) => (
        <React.Fragment key={cmd.name}>
          <CommandButton command={cmd} onClick={executeCommand} />
          {index < commandList.length - 1 && (
            <span className="text-gray-400 hidden md:inline">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const ContactLink = ({
  icon,
  href,
  text,
  className,
}: {
  icon: React.ReactNode;
  href: string;
  text: string;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center ${className}`}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </a>
);

// Memoized to prevent re-renders of already-rendered history items
// during typing animation or when new items are added to the history array.
const HistoryLine = React.memo(({ line }: { line: HistoryItem }) => {
  if (typeof line === "string") {
    return <TerminalOutput html={line} />;
  }

  if (typeof line === "object" && line !== null) {
    switch (line.type) {
      case "fastfetch":
        const { 
          name, os, kernel, uptime, shell, terminal, resolution,
          cpu, gpu, memoryUsed, deviceType, platform, contact, art, title 
        } = line.data;
        const fastfetchArt = art
          .split('\n')
          .map(line => line.replace(/ /g, '&nbsp;'))
          .join('<br>')
          .replace('class="text-green-400"', 'class="text-primary"');

        return (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 pr-0 md:pr-4 mb-4 md:mb-0">
              <div className="font-mono whitespace-pre">
                <TerminalOutput html={fastfetchArt} />
              </div>
            </div>
            <div className="w-full md:w-2/3 flex flex-col space-y-1 text-xs md:text-sm">
              <div>
                <span className="text-green-400 font-bold">
                  {name}@terminal
                </span>
              </div>
              <div>{"-".repeat(`${name}@terminal`.length)}</div>
              <div className="space-y-1">
                <div><span className="font-bold text-indigo-400">Title:</span> <span className="text-yellow-400">{title}</span></div>
                <div><span className="font-bold text-indigo-400">OS:</span> <span className="text-blue-400">{os}</span></div>
                <div><span className="font-bold text-indigo-400">Host:</span> <span className="text-blue-300">{deviceType} ({platform})</span></div>
                <div><span className="font-bold text-indigo-400">Kernel:</span> <span className="text-blue-200">{kernel}</span></div>
                <div><span className="font-bold text-indigo-400">Uptime:</span> <span className="text-green-400">{uptime}</span></div>
                <div><span className="font-bold text-indigo-400">Shell:</span> <span className="text-purple-400">{shell}</span></div>
                <div><span className="font-bold text-indigo-400">Display:</span> <span className="text-orange-400">{resolution}</span></div>
                <div><span className="font-bold text-indigo-400">DE:</span> <span className="text-purple-300">{terminal}</span></div>
                <div><span className="font-bold text-indigo-400">Terminal:</span> <span className="text-purple-200">{shell}</span></div>
                <div><span className="font-bold text-indigo-400">CPU:</span> <span className="text-red-400">{cpu}</span></div>
                <div><span className="font-bold text-indigo-400">GPU:</span> <span className="text-red-300">{gpu}</span></div>
                {memoryUsed !== "Unknown" && <div><span className="font-bold text-indigo-400">Memory:</span> <span className="text-red-200">{memoryUsed}</span></div>}
                <div><span className="font-bold text-indigo-400">Locale:</span> <span className="text-gray-300">{line.data.language}</span></div>
              </div>
              <div className="pt-2">
                <div><span className="font-bold text-indigo-400">Contact:</span></div>
                <div className="ml-4 flex flex-col space-y-1">
                  <ContactLink
                    icon={<FaEnvelope size={14} className="text-red-400" />}
                    href={`mailto:${contact.email}`}
                    text={contact.email}
                    className="text-yellow-300 hover:text-yellow-100 break-all"
                  />
                  <ContactLink
                    icon={<FaGithub size={14}/>}
                    href={`https://github.com/${contact.github}`}
                    text={contact.github}
                    className="text-white hover:text-green-100 break-all"
                  />
                  <ContactLink
                    icon={<FaLinkedin size={14} className="text-blue-400" />}
                    href={`https://linkedin.com/in/${contact.linkedin}`}
                    text={contact.linkedin}
                    className="text-blue-300 hover:text-blue-100 break-all"
                  />
                </div>
              </div>
              {/* ANSI-style color palette blocks */}
              <div className="pt-3">
                <div className="flex gap-0">
                  {['#1e1e1e','#e06c75','#98c379','#e5c07b','#61afef','#c678dd','#56b6c2','#abb2bf'].map((c) => (
                    <span key={c} style={{ backgroundColor: c, width: '1.5em', height: '1em', display: 'inline-block' }} />
                  ))}
                </div>
                <div className="flex gap-0">
                  {['#5c6370','#e06c75','#98c379','#d19a66','#61afef','#c678dd','#56b6c2','#ffffff'].map((c) => (
                    <span key={c+'-b'} style={{ backgroundColor: c, width: '1.5em', height: '1em', display: 'inline-block' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <TerminalOutput html={JSON.stringify(line)} />;
    }
  }

  return null;
});

HistoryLine.displayName = "HistoryLine";

// Helper to extract text content from HistoryItem
const getHistoryItemText = (line: HistoryItem): string => {
  if (typeof line === "string") {
    return line.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  }
  if (line.type === "fastfetch") {
    const { name, os, kernel, uptime, shell, terminal, resolution, cpu, gpu, memoryUsed, deviceType, platform, contact } = line.data;
    return `Name: ${name}\nOS: ${os}\nKernel: ${kernel}\nUptime: ${uptime}\nShell: ${shell}\nTerminal: ${terminal}\nDisplay: ${resolution}\nCPU: ${cpu}\nGPU: ${gpu}\nMemory: ${memoryUsed}\nHost: ${deviceType} (${platform})\nContact: ${contact.email} | ${contact.github} | ${contact.linkedin}`;
  }
  return "";
};

const CopyableOutput = ({ line }: { line: HistoryItem }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = getHistoryItemText(line);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore copy errors
    }
  };

  return (
    <div className="group relative">
      <HistoryLine line={line} />
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 p-1 text-xs text-green-400 opacity-0 group-hover:opacity-100 hover:bg-green-900/50 rounded transition-opacity"
        title="Copy output"
        aria-label="Copy output to clipboard"
      >
        {copied ? <FaCheck className="text-green-400" /> : <FaCopy className="text-gray-400 hover:text-green-400" />}
      </button>
    </div>
  );
};

const TerminalHistory = ({ history }: { history: HistoryItem[] }) => (
  <div>
    {history.map((line, index) => (
      <div key={index} className="mb-2">
        <CopyableOutput line={line} />
      </div>
    ))}
  </div>
);

// Separate component for the currently-typing output line.
// This isolates typing animation re-renders from the committed history array.
const TypingOutput = ({ content }: { content: string | null }) => {
  if (content === null) return null;
  return (
    <div className="mb-2">
      <TerminalOutput html={content} />
    </div>
  );
};

const TerminalInput = ({
  input,
  promptLine1,
  promptLine2,
  isTyping,
  onInputChange,
  onInputKeyDown,
}: {
  input: string;
  promptLine1: string;
  promptLine2: string;
  isTyping: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) =>
  !isTyping && (
    <div>
      <div>
        <TerminalOutput html={promptLine1} />
      </div>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <TerminalOutput html={promptLine2} />
        </div>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          className="bg-transparent border-none text-green-400 focus:outline-none caret-transparent p-0"
          autoComplete="off"
          autoFocus
          disabled={isTyping}
          aria-label="Command input"
          style={{ width: `${input.length}ch` }}
        />
        <span className="blinking-cursor text-green-500">█</span>
      </div>
    </div>
  );

const Terminal = () => {
  const {
    history,
    currentTypingOutput,
    input,
    isTyping,
    terminalRef,
    promptLine1,
    promptLine2,
    handleInputChange,
    handleInputKeyDown,
    executeCommand,
  } = useTerminal();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, currentTypingOutput, isTyping, terminalRef]);

  return (
    <div className="w-full h-full bg-black shadow-lg flex flex-col terminal">
      <TerminalHeader executeCommand={executeCommand} />
      <div
        ref={terminalRef}
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
        className="p-2 md:p-4 text-white font-mono flex-grow overflow-y-auto"
        onClick={() => document.getElementById("terminal-input")?.focus()}
      >
        <TerminalHistory history={history} />
        <TypingOutput content={currentTypingOutput} />
        <TerminalInput
          input={input}
          promptLine1={promptLine1}
          promptLine2={promptLine2}
          isTyping={isTyping}
          onInputChange={handleInputChange}
          onInputKeyDown={handleInputKeyDown}
        />
      </div>
    </div>
  );
};

export default Terminal;