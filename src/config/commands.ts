export interface Command {
  name: string;
  description: string;
  isDisplayed?: boolean;
  icon?: string;
}

export const commands: { [key: string]: Command } = {
  help: { name: "help", description: "Show available commands", isDisplayed: true },
  fastfetch: { name: "fastfetch", description: "Display a summary of my profile", isDisplayed: true },
  about: { name: "about", description: "Learn about me", isDisplayed: true },
  projects: { name: "projects", description: "View my projects", isDisplayed: true },
  skills: { name: "skills", description: "Explore my technical expertise", isDisplayed: true },
  experience: { name: "experience", description: "View my work experience", isDisplayed: true },
  education: { name: "education", description: "See my education background", isDisplayed: true },
  contact: { name: "contact", description: "Get my contact information", isDisplayed: true },
  clear: { name: "clear", description: "Clear the terminal", isDisplayed: true },
  globe: { name: "globe", description: "Launch interactive 3D globe", isDisplayed: true },
  exit: { name: "exit", description: "Exit the current view (e.g., globe)", isDisplayed: false },
  sudo: { name: "sudo", description: "Try to get root access (just for fun)", isDisplayed: false },
  echo: { name: "echo", description: "Echo back your text", isDisplayed: false },
  date: { name: "date", description: "Show current date and time", isDisplayed: false },
  whoami: { name: "whoami", description: "Display current user", isDisplayed: false },
};

export const commandList = Object.values(commands).filter(cmd => cmd.isDisplayed); 