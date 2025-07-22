"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { commands, commandList } from "@/config/commands";
import { portfolioData } from "@/data/portfolio";
import { closest } from "fastest-levenshtein";

interface FastfetchData {
  type: "fastfetch";
  data: {
    name: string;
    title: string;
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
    memory: string;
    memoryUsed: string;
    deviceType: string;
    platform: string;
    timezone: string;
    language: string;
    languages: string;
    contact: {
      email: string;
      github: string;
      linkedin: string;
    };
    art: string;
  };
}

interface ContactData {
  type: "contact";
  data: {
    email: string;
    github: string;
    linkedin: string;
  };
}

type HistoryItem = string | FastfetchData | ContactData;
type CommandOutput = string | FastfetchData | ContactData;
type CommandHandler = (args: string[]) => CommandOutput;

interface UserAgentData {
  platform?: string;
}

const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  
  
  let platform = "Unknown";
  
  if ('userAgentData' in navigator) {
    const userAgentData = (navigator as { userAgentData?: UserAgentData }).userAgentData;
    if (userAgentData && userAgentData.platform) {
      platform = userAgentData.platform;
    }
  }
  
  if (platform === "Unknown") {
    if (userAgent.includes("Windows")) {
      platform = "Windows";
    } else if (userAgent.includes("Mac")) {
      platform = "macOS";
    } else if (userAgent.includes("Linux") && !userAgent.includes("Android")) {
      platform = "Linux";
    } else if (userAgent.includes("Android")) {
      platform = "Android";
    } else if (userAgent.includes("iPhone")) {
      platform = "iPhone";
    } else if (userAgent.includes("iPad")) {
      platform = "iPad";
    }
  }
  
  let os = "Unknown OS";
  let kernel = "Unknown";
  let deviceType = "Desktop";
  
  if (userAgent.includes("Windows")) {
    os = "Windows";
    kernel = "NT";
  } else if (userAgent.includes("Mac OS X")) {
    os = "macOS";
    kernel = "Darwin";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
    kernel = "Linux";
    if (userAgent.includes("Ubuntu")) os = "Ubuntu";
    else if (userAgent.includes("Fedora")) os = "Fedora";
    else if (userAgent.includes("CentOS")) os = "CentOS";
  } else if (userAgent.includes("Android")) {
    deviceType = "Mobile";
    os = "Android";
    kernel = "Linux";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    deviceType = userAgent.includes("iPad") ? "Tablet" : "Mobile";
    os = "iOS";
    kernel = "XNU";
  }

  let shell = "Unknown Browser";
  let terminal = "Web Browser";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    shell = "Chrome";
    terminal = "Chromium Engine";
  } else if (userAgent.includes("Firefox")) {
    shell = "Firefox";
    terminal = "Gecko Engine";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    shell = "Safari";
    terminal = "WebKit Engine";
  } else if (userAgent.includes("Edg")) {
    shell = "Edge";
    terminal = "Chromium Engine";
  }

  const resolution = `${screen.width}x${screen.height}`;
  const colorDepth = `${screen.colorDepth}-bit`;
  const pixelRatio = window.devicePixelRatio || 1;
  
  const memory = "Available";
  const memoryUsed = "Available";

  const cores = navigator.hardwareConcurrency || "Unknown";
  const cpu = cores !== "Unknown" ? `${cores} cores` : "Unknown CPU";

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const languages = navigator.languages ? navigator.languages.join(', ') : language;

  const uptime = Math.floor(performance.now() / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  let gpu = "Unknown GPU";
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && 'getExtension' in gl && 'getParameter' in gl) {
      const webglContext = gl as WebGLRenderingContext;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer) {
          
          const rendererStr = renderer.toString();
          if (rendererStr.includes('Intel') && rendererStr.includes('Graphics')) {
            gpu = 'Intel Graphics [Integrated]';
          } else if (rendererStr.includes('NVIDIA') || rendererStr.includes('RTX') || rendererStr.includes('GTX')) {
            gpu = 'NVIDIA Graphics [Discrete]';
          } else if (rendererStr.includes('AMD') || rendererStr.includes('Radeon')) {
            gpu = 'AMD Graphics [Discrete]';
          } else {
            gpu = 'Graphics Card Available';
          }
        }
      }
    }
  } catch {
    gpu = "Unknown GPU";
  }

  return {
    os,
    kernel,
    deviceType,
    shell,
    terminal,
    platform,
    resolution,
    colorDepth,
    pixelRatio,
    memory,
    memoryUsed,
    cpu,
    cores,
    gpu,
    timezone,
    language,
    languages,
    uptime: uptimeStr,
    userAgent: "Browser"
  };
};

export const useTerminal = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const isTypingRef = useRef(isTyping);
  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);
  const [showGlobe, setShowGlobe] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const typingInterruptRef = useRef(false);

  const allCommandNames = Object.keys(commands);

  const promptLine1 = `<span class="text-green-400">┌─(</span><span class="text-indigo-500 font-bold">daroh@terminal</span><span class="text-green-400">)-[~]</span>`;
  const promptLine2 = `<span class="text-green-400">└─</span><span class="text-indigo-500">$</span>&nbsp;`;

  const commandHandlers: { [key: string]: CommandHandler } = useMemo(
    () => ({
      help: () =>
        `Available commands:<br>${commandList
          .map((cmd) => `&nbsp;- ${cmd.name}: ${cmd.description}`)
          .join("<br>")}`,
      fastfetch: (): FastfetchData => {
        const deviceInfo = getDeviceInfo();
        return {
          type: "fastfetch",
          data: {
            name: portfolioData.fastfetch.name,
            title: portfolioData.fastfetch.title,
            os: deviceInfo.os,
            kernel: deviceInfo.kernel,
            uptime: deviceInfo.uptime,
            shell: deviceInfo.shell,
            terminal: deviceInfo.terminal,
            resolution: deviceInfo.resolution,
            colorDepth: deviceInfo.colorDepth,
            pixelRatio: deviceInfo.pixelRatio,
            cpu: deviceInfo.cpu,
            gpu: deviceInfo.gpu,
            memory: deviceInfo.memory,
            memoryUsed: deviceInfo.memoryUsed,
            deviceType: deviceInfo.deviceType,
            platform: deviceInfo.platform,
            timezone: deviceInfo.timezone,
            language: deviceInfo.language,
            languages: deviceInfo.languages,
            contact: portfolioData.fastfetch.contact,
            art: portfolioData.fastfetch.art
          },
        };
      },
      about: () => portfolioData.about,
      projects: () => {
        const title = `<span class="text-green-400">All Projects</span><br><br>`;
        
        // Regular projects with dates
        const regularProjectsTitle = `<span class="text-yellow-400">Development Projects</span><br>`;
        const projectsList = portfolioData.projects
          .map(
            (p, i) =>
              `&nbsp;&nbsp;<span class="text-cyan-400">${i + 1}. ${
                p.title
              }</span> <span class="text-gray-400">(${p.date})</span><br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;${p.description}<br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-400">Tech:</span> ${p.stack}`
          )
          .join("<br><br>");
        
        // ML projects
        const mlProjectsTitle = `<br><br><span class="text-yellow-400">Machine Learning Projects</span><br>`;
        const mlProjectsList = portfolioData.mlProjects
          .map(
            (p, i) =>
              `&nbsp;&nbsp;<span class="text-cyan-400">${portfolioData.projects.length + i + 1}. ${
                p.title
              }</span><br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;${p.description}<br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-400">Tech:</span> ${p.stack}`
          )
          .join("<br><br>");
        
        // Personal projects
        const personalProjectsTitle = `<br><br><span class="text-yellow-400">Personal Projects</span><br>`;
        const personalProjectsList = portfolioData.personalProjects
          .map(
            (p, i) =>
              `&nbsp;&nbsp;<span class="text-cyan-400">${portfolioData.projects.length + portfolioData.mlProjects.length + i + 1}. ${
                p.title
              }</span><br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;${p.description}<br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-400">Tech:</span> ${p.stack}`
          )
          .join("<br><br>");
        
        return title + regularProjectsTitle + projectsList + mlProjectsTitle + mlProjectsList + personalProjectsTitle + personalProjectsList;
      },
      skills: () => {
        const title = `<span class="text-green-400">Technical Skills</span><br>`;
        const skillsList = portfolioData.skills
          .map(
            (s) =>
              `&nbsp;&nbsp;<span class="text-yellow-400">${s.category}:</span> ${s.items}`
          )
          .join("<br>");
        return title + skillsList;
      },
      experience: () => portfolioData.experience,
      education: () => portfolioData.education,
      contact: (): ContactData => ({
        type: "contact",
        data: portfolioData.fastfetch.contact
      }),
      globe: () => {
        setShowGlobe(true);
        return "Launching globe... Please use 'exit' to return to the terminal.";
      },
      sudo: () => `<span class="text-red">Permission denied.</span> Nice try though! 😄`,
      echo: (args) => {

        const escapeHtml = (str: string) => {
          return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };
        return escapeHtml(args.join(" "));
      },
      date: () => new Date().toString(),
      whoami: () => "daroh@terminal",
      clear: () => {
        if (showGlobe) {
          return "Cannot clear the terminal while the globe is active. Use 'exit' to return.";
        }
        setHistory([]);
        return "";
      },
    }),
    [showGlobe]
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
        const singleWordCommand = command.split(" ")[0];
        const suggestion = closest(singleWordCommand, allCommandNames);
        let suggestionText = "";
        if (suggestion) {
          suggestionText = `<br>Did you mean '<span class="text-yellow-400">${suggestion}</span>'?`;
        }
        output = `<span class="text-red-400">Command not found: ${singleWordCommand}</span><br>Type 'help' for a list of available commands.${suggestionText}`;
      }

      if (typeof output === "object") {
        setHistory([...currentHistory, output, ""]);
        setIsTyping(false);
      } else if (typeof output === "string") {
        setIsTyping(true);
        typingInterruptRef.current = false;
        setHistory([...currentHistory, ""]);

        await new Promise((res) => setTimeout(res, 50));

        let typedOutput = "";
        const typingDelay = 0;

        for (let i = 0; i < output.length; i++) {
            if (typingInterruptRef.current) {
                setHistory(prevHistory => {
                    const newHistory = [...prevHistory];
                    const lastLine = newHistory[newHistory.length-1];
                    if (typeof lastLine === 'string') {
                        newHistory[newHistory.length-1] = lastLine + '<span class="text-red-400">^C</span>';
                    }
                    newHistory.push('');
                    return newHistory;
                });
                setIsTyping(false);
                return;
            }

            const tagMatch = output.substring(i).match(/^<[^>]+>/);
            const entityMatch = output.substring(i).match(/^&[a-zA-Z0-9#]+;/);

            if (tagMatch) {
                const tag = tagMatch[0];
                typedOutput += tag;
                i += tag.length - 1;
            } else if (entityMatch) {
                const entity = entityMatch[0];
                typedOutput += entity;
                i += entity.length - 1;
            } else {
                typedOutput += output[i];
            }
            
            setHistory(prevHistory => {
                const newHistory = [...prevHistory];
                newHistory[newHistory.length - 1] = typedOutput;
                return newHistory;
            });

            if (i < output.length - 1) {
                await new Promise((res) => setTimeout(res, typingDelay));
            }
        }
        
        setHistory(prevHistory => [...prevHistory, '']);
        setIsTyping(false);
      }
    },
    [allCommandNames, commandHandlers]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxInputLength = 1000;
    const newInput = e.target.value.slice(0, maxInputLength);
    setInput(newInput);
  };

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle Ctrl+C with multiple detection methods
      if ((e.ctrlKey && (e.key === "c" || e.key === "C")) || 
          (e.ctrlKey && e.keyCode === 67) ||
          (e.metaKey && (e.key === "c" || e.key === "C"))) {
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
      
      if (e.key === "Enter" && !isTyping) {
        if (input.trim() === "") {
          setHistory([...history, `${promptLine1}<br>${promptLine2}`, ""]);
          setInput("");
          return;
        }
        const newCommandHistory = [...commandHistory, input];
        setCommandHistory(newCommandHistory);
        setHistoryIndex(newCommandHistory.length);
        const newHistory = [
          ...history,
          `${promptLine1}<br>${promptLine2}<span class="text-green-400">${input}</span>`,
        ];
        processCommand(input.toLowerCase(), newHistory);
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
        if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
          setInput(commandHistory[historyIndex - 1]);
        } else if (commandHistory.length > 0) {
          const newIndex = commandHistory.length - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          setHistoryIndex(historyIndex + 1);
          setInput(commandHistory[historyIndex + 1]);
        } else {
          setHistoryIndex(commandHistory.length);
          setInput("");
        }
      }
    },
    [
      allCommandNames,
      commandHistory,
      history,
      historyIndex,
      input,
      isTyping,
      processCommand,
      promptLine1,
      promptLine2,
    ]
  );

  const executeCommand = useCallback(
    (command: string) => {
      const newCommandHistory = [...commandHistory, command];
      setCommandHistory(newCommandHistory);
      setHistoryIndex(newCommandHistory.length);
      const newHistory = [
        ...history,
        `${promptLine1}<br>${promptLine2}<span class="text-green-400">${command}</span>`,
      ];
      processCommand(command.toLowerCase(), newHistory);
      setInput("");
    },
    [commandHistory, history, processCommand, promptLine1, promptLine2]
  );

  useEffect(() => {
    const initialCommand = "welcome";
    const welcomeMessage =
      "Welcome to my portfolio terminal!<br>Type 'help' to see available commands.";
    const newHistory = [
      `${promptLine1}<br>${promptLine2}<span class="text-green-400">${initialCommand}</span>`,
    ];

    const typeMessage = async () => {
      setIsTyping(true);
      typingInterruptRef.current = false; 
      setHistory([...newHistory, ""]);

      await new Promise((res) => setTimeout(res, 50));

      let typedOutput = "";
      const typingDelay = 0;

      for (let i = 0; i < welcomeMessage.length; i++) {
       
        if (typingInterruptRef.current) {
            setHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                const lastLine = newHistory[newHistory.length-1];
                if (typeof lastLine === 'string') {
                    newHistory[newHistory.length-1] = lastLine + '<span class="text-red-400">^C</span>';
                }
                newHistory.push('');
                return newHistory;
            });
            setIsTyping(false);
            return;
        }

        const tagMatch = welcomeMessage.substring(i).match(/^<[^>]+>/);
        const entityMatch = welcomeMessage.substring(i).match(/^&[a-zA-Z0-9#]+;/);
        if (tagMatch) {
          const tag = tagMatch[0];
          typedOutput += tag;
          i += tag.length - 1;
        } else if (entityMatch) {
          const entity = entityMatch[0];
          typedOutput += entity;
          i += entity.length - 1;
        } else {
          typedOutput += welcomeMessage[i];
        }

        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[newHistory.length - 1] = typedOutput;
          return newHistory;
        });

        if (i < welcomeMessage.length - 1) {
          await new Promise((res) => setTimeout(res, typingDelay));
        }
      }

      setHistory((prevHistory) => [...prevHistory, ""]);
      setIsTyping(false);
    };

    typeMessage();

    return () => {
    };
  }, [promptLine1, promptLine2]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        isTypingRef.current &&
        (e.ctrlKey || e.metaKey) &&
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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return {
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
  };
}; 