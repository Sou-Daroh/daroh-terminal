# 🖥️ Daroh-Terminal

A sleek, terminal-inspired portfolio website that showcases my journey as a full-stack developer through an interactive command-line interface.

## ✨ Features

- **Interactive Terminal**: Navigate through my portfolio using familiar terminal commands
- **3D Globe Viewer**: Launch an interactive 3D globe with `globe`
- **Real-time Status Bar**: Shows current date, time, and system information
- **Responsive Design**: Optimized for both desktop and mobile experiences
- **Multiple Commands**: Explore different sections with intuitive commands

## 🚀 Available Commands

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
| `cv` | Download my CV |
| `globe` | Launch the interactive 3D globe viewer |
| `exit` | Return from the globe viewer to the terminal |
| `clear` | Clear the terminal screen |
| `date` | Show current date and time |
| `whoami` | Display current user information |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Font**: Custom monospace fonts (Antonio Bold, LTYPE)
- **Deployment**: Vercel

## Requirements

- Node.js 18+ (recommended 20+)
- npm 9+ (or pnpm/yarn)

## 🏃‍♂️ Getting Started

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

5. **Start exploring!**
   Type `help` in the terminal to see all available commands

## 💡 Usage

- Type any command and press Enter to execute
- Use `help` to see all available commands
- Try `fastfetch` for a quick overview
- Use `globe` to open the 3D globe viewer
- Type `exit` to return from the globe viewer to the terminal

## 📱 Responsive Design

The terminal interface adapts seamlessly across devices:
- **Desktop**: Full terminal experience with all features
- **Mobile**: Touch-friendly interface with virtual keyboard support
- **Tablet**: Optimized layout for medium screens

## 🔧 Development

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

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). Simply connect your repository and deploy!

For other platforms, build and start the Node server:

```bash
npm run build
npm start
```

## 🎨 Customization

- **Commands**: Modify `src/config/commands.ts` to add or remove commands
- **Portfolio Data**: Update `src/data/portfolio.ts` with your information
- **Styling**: Customize the theme in `src/app/globals.css`
- **Components**: Extend functionality by modifying components in `src/components/`

## License

MIT
