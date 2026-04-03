# Trading Journal - Desktop App Setup

This guide will help you turn your Trading Journal web app into a standalone Windows desktop application with its own icon and installer.

## Prerequisites

1. **Node.js** (LTS version)
   - Download from: https://nodejs.org/
   - Make sure to check "Add to PATH" during installation
   - Verify installation: Open Command Prompt and type `node --version`

2. **Git** (optional, but recommended)
   - Download from: https://git-scm.com/

## Setup Steps

### Step 1: Extract and Prepare
1. Extract the project ZIP file to your desired location
2. Open Command Prompt in the project folder
3. Run: `npm install` (or `pnpm install` if you have pnpm)

### Step 2: Generate App Icon
1. Place a 512x512 PNG image in the `public/` folder named `icon.png`
2. Download a free icon converter tool, or use an online converter to create `icon.ico` from `icon.png`
3. Save the `.ico` file as `public/icon.ico`

Alternatively, we've included a default icon that you can customize later.

### Step 3: Build the Desktop App

Run one of these commands:

**For Windows Installer + Portable Exe:**
```bash
npm run electron-build-win
```

This creates:
- An installer (Trading-Journal-Setup.exe)
- A portable executable (Trading-Journal.exe)
- Both in the `dist/` folder

**For Development/Testing:**
```bash
npm run electron-dev
```

This runs the app in development mode with hot reload.

### Step 4: Run the App

After building:
1. Open the `dist/` folder
2. Double-click `Trading-Journal-Setup.exe` to install
3. Or double-click `Trading-Journal.exe` to run without installation

The app will:
- Launch in its own window (not a browser)
- Have its own icon in the taskbar
- Appear in Windows Start Menu (if installed)
- Store data locally on your computer

## What Happens During Build

1. **Next.js Build** - Your web app is optimized and compiled
2. **Electron Package** - Your app is wrapped in Electron (desktop framework)
3. **Windows Installer Creation** - An installer is generated for easy distribution

The entire process takes 5-10 minutes on first build.

## Customization

### App Icon
- Replace `public/icon.ico` with your own 256x256+ pixel icon
- Regenerate with `npm run electron-build-win`

### App Name
- Edit `package.json` → `"productName": "Trading Journal"`
- Edit `package.json` → Build section name

### Window Size
- Edit `electron/main.ts` → `createWindow()` function
- Adjust `width` and `height` values

### Startup Size
- Edit `electron/main.ts` → `minWidth` and `minHeight` for minimum window size

## Troubleshooting

### "Command not found: npm"
- Node.js wasn't added to PATH during installation
- Reinstall Node.js and make sure to check "Add to PATH"

### Build takes too long
- First build always takes longer (downloads dependencies)
- Subsequent builds are faster
- Can take 5-15 minutes depending on your internet speed

### App won't start
1. Check that all dependencies are installed: `npm install`
2. Try `npm run electron-dev` to see error messages
3. Check that Node.js version is LTS or newer: `node --version`

### Need to clear and rebuild
```bash
npm run clean
npm install
npm run electron-build-win
```

## File Structure

```
project/
├── app/                    # Next.js app (your trading journal)
├── electron/               # Electron config files
│   ├── main.ts            # Main process
│   └── preload.ts         # Security bridge
├── public/
│   └── icon.ico           # App icon (customize this)
├── next.config.js         # Next.js config
├── package.json           # Dependencies and scripts
└── DESKTOP_APP_SETUP.md   # This file
```

## Next Steps

1. Build your desktop app: `npm run electron-build-win`
2. Find the installer in the `dist/` folder
3. Share the installer with others or keep it for your own use
4. To update the app, rebuild and distribute the new installer

## Support

For issues with:
- **Next.js app logic** - Check your app code in `app/` folder
- **Electron/Desktop issues** - Check `electron/main.ts`
- **Dependencies** - Update `package.json`

Good luck with your Trading Journal desktop app!
