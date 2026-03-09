# Daroh-Terminal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license) [![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/) [![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A sleek, terminal-inspired portfolio website that showcases my journey as a full-stack developer through an interactive command-line interface.

## Features

- **Interactive Terminal**: Navigate my portfolio using real terminal commands — no GUI needed
- **3D Globe Viewer**: Visualize my global experience with an interactive WebGL globe (`globe`)
- **Real-time Status Bar**: Live date, time, and system info in the footer
- **Fully Responsive**: Touch-friendly on mobile, full-featured on desktop

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `fastfetch` | Display a summary of my profile |
| `about` | Learn about me and my background |
| `skills` | Explore my technical expertise |
| `projects` | View my portfolio projects |
| `experience` | See my work experience and internships |
| `education` | Check out my educational background |
| `contact` | Get my contact information |
| `cv` | Download my CV as a PDF |
| `globe` | Launch the interactive 3D globe viewer |
| `exit` | Return from the globe viewer to the terminal |
| `clear` | Clear the terminal screen |
| `date` | Show current date and time |
| `whoami` | Display current user information |

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Font**: Custom monospace fonts (Antonio Bold, LTYPE)
- **Deployment**: Vercel

## Requirements

- Node.js 18+ (recommended 20+)
- npm 9+ (or pnpm/yarn)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daroh-terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Start exploring**
   Type `help` in the terminal to see all available commands

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the code
npm run lint
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). Simply connect your repository and deploy.

For other platforms, build and start the Node server:

```bash
npm run build
npm start
```

## Customization

- **Commands**: Modify `src/config/commands.ts` to add or remove commands
- **Portfolio Data**: Update `src/data/portfolio.ts` with your information
- **Styling**: Customize the theme in `src/app/globals.css`
- **Components**: Extend functionality by modifying components in `src/components/`

## License

MIT
