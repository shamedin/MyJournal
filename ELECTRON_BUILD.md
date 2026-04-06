## Trading Journal - Electron Desktop App Build Guide

### Prerequisites
- Node.js 16+ and pnpm installed
- Windows OS (for building .exe)

### Installation

1. **Install Dependencies**:
```bash
pnpm install
```

This will install both Next.js dependencies and Electron/electron-builder packages.

### Development Mode

Run the app in development with live reload:

```bash
pnpm run dev:electron
```

This will:
- Start Next.js dev server on http://localhost:3000
- Launch Electron window after 3 seconds
- Enable hot reload for both frontend and Electron changes

### Building for Production

#### Option 1: Build as Standalone .exe Installer (RECOMMENDED)

```bash
pnpm run dist
```

This creates:
- `dist/Trading Journal Setup 1.0.0.exe` - Full installer with desktop/start menu shortcuts
- `dist/Trading Journal-1.0.0-portable.exe` - Portable version (no installation needed)

The installer will:
- Create desktop shortcut
- Create Start Menu entry
- Allow user to choose installation directory
- Enable easy uninstall via Windows Add/Remove Programs

#### Option 2: Build for Development Testing

```bash
pnpm run build:electron
```

### Distribution

**To distribute to users:**

1. Generate the installer:
```bash
pnpm run dist
```

2. Share `dist/Trading Journal Setup 1.0.0.exe` with users
3. Users run the installer and click the created desktop shortcut

**File Locations After Installation:**
- Default: `C:\Users\{User}\AppData\Local\Programs\Trading Journal\`
- Desktop Shortcut: `C:\Users\{User}\Desktop\Trading Journal.lnk`
- Start Menu: `Start Menu > Trading Journal`

### App Features

✓ Fully offline - all data stored in localStorage
✓ Light theme by default with dark mode toggle
✓ Responsive sidebar navigation (hamburger on mobile)
✓ Trading journal with complete analytics
✓ Trading setups library and dashboard
✓ No backend required - 100% standalone

### Troubleshooting

**"Cannot find module 'electron-is-dev'"**
```bash
pnpm add -D electron-is-dev
```

**Build fails with icon issues**
- Ensure `public/icon.png` and `public/icon.ico` exist
- Regenerate with: `pnpm run build`

**App won't start after installation**
- Check Windows Defender/antivirus isn't blocking execution
- Try portable version instead: `Trading Journal-1.0.0-portable.exe`

### Project Structure

```
/electron
  ├── main.ts         - Electron main process
  └── preload.ts      - Security context bridge
/public
  ├── icon.png        - App icon (512x512)
  └── icon.ico        - Windows icon (256x256)
/out                  - Generated after build (Next.js static export)
electron-builder.json - Build configuration
next.config.js        - Next.js configuration for static export
```

### Version Updates

Update version in `package.json`:
```json
{
  "version": "1.0.1"
}
```

Then rebuild:
```bash
pnpm run dist
```

Installers will be versioned automatically.

### Security Notes

- Context isolation enabled for security
- Node integration disabled in renderer process
- Preload script safely exposes limited APIs
- All data stays local - no external connections

### Support

For issues, check:
1. Electron console (Dev Tools in dev mode)
2. Windows Event Viewer for system errors
3. Try portable version to rule out installation issues
