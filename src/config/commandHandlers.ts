import { commandList, commands } from "@/config/commands";
import { portfolioData } from "@/data/portfolio";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { escapeHtml } from "@/utils/html";
import type { FastfetchData, HistoryItem, CommandHandler } from "@/types/terminal";

interface CommandHandlerDeps {
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  commandHistory: string[];
}

export const createCommandHandlers = ({
  setHistory,
  commandHistory,
}: CommandHandlerDeps): { [key: string]: CommandHandler } => {
  const handlers: { [key: string]: CommandHandler } = {
  help: () =>
    `Available commands:<br>${commandList
      .map((cmd) => `&nbsp;- ${cmd.name}: ${cmd.description}`)
      .join("<br>")}<br><br><span class="text-gray-400">Tip: Try 'man [command]' for detailed info, or 'cat [command]' to view output.</span>`,
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
  contact: () => {
    const { email, github, linkedin } = portfolioData.fastfetch.contact;
    return `
          <span class="text-green-400 font-bold">Contact Information</span><br><br>
          <a href="mailto:${email}" class="text-yellow-300 hover:text-yellow-100" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.5em;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f87171" viewBox="0 0 16 16" style="vertical-align:middle;"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.143l-6.57-4.027L8 9.586l-1.239-.757ZM16 4.697l-5.803 3.546L16 11.801V4.697Z"/></svg>
            ${email}
          </a><br>
          <a href="https://github.com/${github}" class="text-white hover:text-green-100" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.5em;">
            <svg width="16" height="16" fill="#fff" viewBox="0 0 16 16" style="vertical-align:middle;color:#fff;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            github.com/${github}
          </a><br>
          <a href="https://linkedin.com/in/${linkedin}" class="text-blue-300 hover:text-blue-100" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.5em;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 448" style="vertical-align:middle;"><rect width="448" height="448" rx="64" fill="#0A66C2"/><path d="M100.28 150.64h60.84v195.82h-60.84zM130.7 75.85c19.43 0 35.17 15.75 35.17 35.17s-15.74 35.17-35.17 35.17-35.17-15.75-35.17-35.17 15.74-35.17 35.17-35.17zm69.43 74.79h58.34v26.77h.83c8.12-15.38 27.98-31.59 57.57-31.59 61.56 0 72.93 40.52 72.93 93.21v107.43h-60.62V251.8c0-22.68-.43-51.83-31.59-51.83-31.63 0-36.45 24.69-36.45 50.18v96.31h-60.41V150.64z" fill="#fff"/></svg>
            linkedin.com/in/${linkedin}
          </a>
        `;
  },
  cv: () => {
    const cvUrl = "https://drive.google.com/file/d/1qCixImOdVftR9TY4lXJmIeVVRI6Bi_61/view?usp=sharing";
    return `
          <span class="text-yellow-400">Click the link below to view my CV:</span><br>
          <a href="${cvUrl}" class="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
            📄 Daroh_Sou_CV.pdf
          </a><br><br>
          <span class="text-gray-400">The CV will open in a new tab when you click the link.</span>
        `;
  },
  sudo: () => `<span class="text-red">Permission denied.</span> Nice try though! 😄`,
  echo: (args) => {
    return escapeHtml(args.join(" "));
  },
  date: () => new Date().toString(),
  whoami: () => "daroh@terminal",
  clear: () => {
    setHistory([]);
    return "";
  },
  pwd: () => `<span class="text-blue-400">~/daroh/portfolio</span>`,
  man: (args) => {
    const cmdName = args[0];
    if (!cmdName) {
      return `<span class="text-red-400">What manual page do you want?</span><br>Usage: man [command]`;
    }
    const cmd = commands[cmdName];
    if (!cmd) {
      return `<span class="text-red-400">No manual entry for ${escapeHtml(cmdName)}</span>`;
    }
    return (
      `<span class="text-yellow-400 font-bold">${cmd.name.toUpperCase()}(1)</span><br><br>` +
      `<span class="text-green-400 font-bold">NAME</span><br>` +
      `&nbsp;&nbsp;&nbsp;&nbsp;${cmd.name} - ${cmd.description}<br><br>` +
      `<span class="text-green-400 font-bold">SYNOPSIS</span><br>` +
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="font-bold">${cmd.name}</span>${cmdName === 'echo' ? ' [text...]' : cmdName === 'man' ? ' [command]' : cmdName === 'cat' ? ' [command]' : ''}<br><br>` +
      `<span class="text-green-400 font-bold">DESCRIPTION</span><br>` +
      `&nbsp;&nbsp;&nbsp;&nbsp;${cmd.description}`
    );
  },
  cat: (args) => {
    const target = args[0];
    if (!target) {
      return `<span class="text-red-400">cat: missing operand</span><br>Usage: cat [command]`;
    }
    const handler = handlers[target];
    if (!handler) {
      return `<span class="text-red-400">cat: ${escapeHtml(target)}: No such file or directory</span>`;
    }
    // Delegate to the target handler (but avoid recursive cat or dangerous side-effects)
    if (target === 'cat' || target === 'clear') {
      return `<span class="text-red-400">cat: ${escapeHtml(target)}: Is not a readable file</span>`;
    }
    return handler([]);
  },
  // Aliases
  ls: () =>
    `Available commands:<br>${commandList
      .map((cmd) => `&nbsp;- ${cmd.name}: ${cmd.description}`)
      .join("<br>")}`,
  neofetch: (): FastfetchData => {
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
  history: () => {
    if (commandHistory.length === 0) {
      return "No commands in history.";
    }
    const lines = commandHistory.map(
      (cmd, i) => `&nbsp;&nbsp;<span class="text-gray-400">${String(i + 1).padStart(4, '\u00A0')}</span>&nbsp;&nbsp;${escapeHtml(cmd)}`
    );
    return lines.join("<br>");
  },
  };
  return handlers;
};
