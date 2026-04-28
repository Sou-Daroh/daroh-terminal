export interface FastfetchData {
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

export interface ContactData {
  type: "contact";
  data: {
    email: string;
    github: string;
    linkedin: string;
  };
}

export type HistoryItem = string | FastfetchData | ContactData;
export type CommandOutput = string | FastfetchData | ContactData;
export type CommandHandler = (args: string[]) => CommandOutput;
