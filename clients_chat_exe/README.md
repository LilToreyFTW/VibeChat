# VibeChat Desktop Client

A native desktop application for VibeChat built with Electron, providing a seamless chat experience with native OS integration.

## Features

- **Native Desktop Experience**: Full-featured desktop application with native menus and shortcuts
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Auto-Updates**: Automatic updates in production builds
- **Notifications**: Native OS notifications for messages
- **Window Management**: Minimize, maximize, and custom window controls
- **Keyboard Shortcuts**: Native keyboard shortcuts for common actions
- **Security**: Context isolation and secure IPC communication
- **Offline Support**: Basic functionality when offline

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Installation

1. **Clone and install dependencies**
   ```bash
   cd clients_chat_exe
   npm install
   ```

2. **Start in development mode**
   ```bash
   npm run dev
   ```

   This will:
   - Start the React development server on port 3000
   - Launch the Electron app
   - Enable hot reloading for both frontend and Electron

3. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
clients_chat_exe/
├── main.js           # Main Electron process
├── preload.js        # Secure IPC bridge
├── package.json      # Dependencies and scripts
├── assets/           # App icons and assets
│   ├── icon.png     # Main app icon
│   └── icon.ico     # Windows icon
├── build/           # Production build output
└── README.md        # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Development
NODE_ENV=development

# Production API endpoints
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

### Build Configuration

The `package.json` includes build configurations for:

- **Windows**: NSIS installer with desktop shortcuts
- **macOS**: DMG with drag-and-drop installation
- **Linux**: AppImage for easy distribution

## Native Features

### Menu Bar

The application includes a native menu bar with:

- **File Menu**:
  - New Room (Ctrl+N)
  - Join Room (Ctrl+J)
  - Settings (Ctrl+,)
  - Quit (Ctrl+Q)

- **Edit Menu**: Standard edit operations
- **View Menu**: Zoom, reload, dev tools
- **Window Menu**: Window management
- **Help Menu**: About, updates, support links

### Keyboard Shortcuts

- `Ctrl+N` / `Cmd+N`: Create new room
- `Ctrl+J` / `Cmd+J`: Join existing room
- `Ctrl+,` / `Cmd+,`: Open settings
- `Ctrl+Q` / `Cmd+Q`: Quit application
- `F5`: Reload page
- `Ctrl+Shift+I` / `Cmd+Alt+I`: Toggle dev tools
- `F11` / `Ctrl+Cmd+F`: Toggle fullscreen

### Window Controls

- **Minimize/Maximize**: Custom window controls
- **Close Confirmation**: Prevents accidental closes
- **Focus Management**: Handles window focus/blur events
- **Responsive Design**: Adapts to different screen sizes

### Notifications

- **Native Notifications**: Uses OS notification system
- **Message Notifications**: Alerts for new messages
- **Update Notifications**: Prompts for app updates
- **Custom Icons**: Uses app icon in notifications

## IPC Communication

The app uses secure IPC communication between processes:

### Main Process → Renderer Process
- `update-status`: Update check status
- `update-error`: Update error messages
- `update-progress`: Download progress
- `update-downloaded`: Update ready to install
- `menu-action`: Menu item clicked
- `window-focus`: Window focus state
- `app-quit-request`: App close confirmation
- `open-room-url`: Handle room URLs (macOS)

### Renderer Process → Main Process
- `get-app-version`: Get app version
- `get-platform`: Get current platform
- `minimize-window`: Minimize window
- `maximize-window`: Toggle maximize
- `close-window`: Close window
- `show-notification`: Show native notification
- `quit-app`: Quit application

## Security Features

- **Context Isolation**: Renderer process is sandboxed
- **No Node Integration**: Renderer cannot access Node.js APIs
- **Secure Preload**: Limited API exposure through preload script
- **External Link Handling**: Opens external links in default browser
- **CSP Headers**: Content Security Policy protection

## Building for Distribution

### Windows

```bash
npm run build:win
```

Creates:
- `dist/VibeChat Desktop Setup 1.0.0.exe` - NSIS installer
- Desktop and Start Menu shortcuts
- Uninstall entry in Control Panel

### macOS

```bash
npm run build:mac
```

Creates:
- `dist/VibeChat Desktop 1.0.0.dmg` - Drag-and-drop installer
- App bundle in Applications folder

### Linux

```bash
npm run build:linux
```

Creates:
- `dist/VibeChat Desktop 1.0.0.AppImage` - Portable AppImage

## Development Tips

### Debugging

1. **Main Process**: Use `console.log` in `main.js`
2. **Renderer Process**: Use browser dev tools (F12)
3. **IPC Debugging**: Check Electron security console

### Hot Reloading

The dev script enables hot reloading for:
- React components
- Electron main process (with nodemon-like behavior)
- CSS and other assets

### Platform-Specific Code

```javascript
// In React components
import { electronAPI } from 'electron';

if (window.electronAPI) {
  // Desktop-specific features
  window.electronAPI.showNotification({
    title: 'New Message',
    body: 'You have a new message!'
  });
}
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Ensure Node.js 16+
   - Clear node_modules and reinstall
   - Check available disk space

2. **App Won't Start**
   - Check for port conflicts (3000, 8080)
   - Verify backend API is running
   - Check firewall settings

3. **Notifications Not Working**
   - Grant notification permissions
   - Check OS notification settings
   - Verify app is focused

4. **Auto-Update Issues**
   - Check internet connection
   - Verify update server configuration
   - Check app signature for macOS

## Contributing

1. Follow Electron security best practices
2. Test on all target platforms
3. Ensure proper IPC communication
4. Add platform-specific workarounds as needed
5. Document new features and APIs

## Integration with VibeChat

The desktop client integrates with:

- **VibeChat Backend API** (Spring Boot)
- **VibeChat Frontend** (React/TypeScript)
- **Room Server** (Node.js/Express)
- **WebSocket Services** (STOMP/SockJS)

It provides a native wrapper that enhances the web experience with desktop features while maintaining full compatibility with the existing VibeChat ecosystem.
