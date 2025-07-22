"use client";

import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTerminal } from "@/hooks/useTerminal";
import { commandList } from "@/config/commands";
import { Command } from "@/config/commands";
import TerminalOutput from "./TerminalOutput";

const Globe = dynamic(() => import("./ui/Globe"), { ssr: false });

interface FastfetchData {
  type: "fastfetch";
  data: {
    name: string;
    os: string;
    kernel: string;
    uptime: string;
    shell: string;
    terminal: string;
    resolution: string;
    colorDepth: string;
    pixelRatio: number;
    cpu: string;
    gpu: string;
    memoryUsed: string;
    deviceType: string;
    platform: string;
    timezone: string;
    language: string;
    contact: {
      email: string;
      github: string;
      linkedin: string;
    };
    art: string;
    title: string;
  };
}

type HistoryItem = string | FastfetchData;

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

const HistoryLine = ({ line }: { line: HistoryItem }) => {
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
            className={`flex items-center ${className}`}
          >
            {icon}
            <span className="ml-2">{text}</span>
          </a>
        );

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
                    className="text-white-300 hover:text-green-100 break-all"
                  />
                  <ContactLink
                    icon={<FaLinkedin size={14} className="text-blue-400" />}
                    href={`https://linkedin.com/in/${contact.linkedin}`}
                    text={contact.linkedin}
                    className="text-blue-300 hover:text-blue-100 break-all"
                  />
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
};

const TerminalHistory = ({ history }: { history: HistoryItem[] }) => (
  <div>
    {history.map((line, index) => (
      <div key={index} className="mb-2">
        <HistoryLine line={line} />
      </div>
    ))}
  </div>
);

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
          className="bg-transparent border-none text-green-400 focus:outline-none caret-transparent -ml-1"
          autoComplete="off"
          autoFocus
          disabled={isTyping}
          style={{ width: input.length > 0 ? `${input.length}ch` : '0ch' }}
        />
        <span className="blinking-cursor text-green-500">█</span>
      </div>
    </div>
  );

const Terminal = () => {
  const {
    history,
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
  } = useTerminal();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isTyping, terminalRef]);

  return (
    <div className="w-full h-full bg-black shadow-lg flex flex-col terminal">
      <TerminalHeader executeCommand={executeCommand} />
      <div
        ref={terminalRef}
        className="p-2 md:p-4 text-white font-mono flex-grow overflow-y-auto"
        onClick={() => document.getElementById("terminal-input")?.focus()}
      >
        <TerminalHistory history={history} />
        <TerminalInput
          input={input}
          promptLine1={promptLine1}
          promptLine2={promptLine2}
          isTyping={isTyping}
          onInputChange={handleInputChange}
          onInputKeyDown={handleInputKeyDown}
        />
      </div>
      <Suspense fallback={null}>
        <Globe isOpen={showGlobe} onClose={() => setShowGlobe(false)} />
      </Suspense>
    </div>
  );
};

export default Terminal; 