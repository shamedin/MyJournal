# Electron + Next.js Desktop App - Build Guide

## Project Structure

Your Trading Journal is now configured as a proper Electron + Next.js static export application:

```
project/
├── index.js                    # Electron main process
├── preload.js                  # Electron security preload
├── next.config.mjs             # Next.js static export config
├── package.json                # Project metadata & build config
├── out/                        # Generated static export (created during build)
├── app/                        # Next.js app directory
├── public/                     # Static assets & app icon
└── node_modules/               # Dependencies
```

## Build Pipeline

The fixed build process now works in stages:

1. **`npm run build`** - Builds Next.js to static HTML/CSS/JS
2. **`next export`** - Exports static files to `/out` directory
3. **`electron-builder`** - Packages everything into Windows .exe

## Setup & Build Instructions

### Initial Setup (One Time)

1. **Install Node.js**
   - Download: https://nodejs.org/ (LTS version)
   - Add to PATH during installation

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Prepare App Icon**
   - The app needs `public/icon.ico` for Windows
   - You already have `public/icon.png`
   - Convert PNG to ICO at: https://convertio.co/png-ico/
   - Save as `public/icon.ico`

### Building for Windows

#### Option 1: One-Command Build
```bash
npm run electron-build-win
```

This does everything:
- Builds Next.js static files
- Exports to `/out`
- Creates Windows installer (.exe)

Output files appear in `dist/`:
- `Trading Journal Setup.exe` - Installer version
- `Trading Journal.exe` - Portable version

#### Option 2: Step-by-Step (for debugging)
```bash
npm run build
npx next export
npx electron-builder --win
```

### Development Testing

Test locally before building:

```bash
npm run electron-dev
```

This runs:
- Next.js dev server on http://localhost:3000
- Electron app loads from dev server
- DevTools opens automatically

Press `Ctrl+C` to stop.

## What Was Fixed

1. ✅ **Removed Turbopack** - Replaced with standard webpack/SWC
2. ✅ **Static Export** - Next.js now exports to `/out` as static HTML
3. ✅ **Proper Electron Main** - Created `index.js` that loads exported app
4. ✅ **Build Config** - Updated `package.json` to include `index.js` and `/out`
5. ✅ **Metadata** - Added description, author, main entry point
6. ✅ **Security** - Added preload script for Electron context isolation
7. ✅ **Scripts** - Build pipeline now: build → export → package

## Troubleshooting

### Error: "index.js does not exist"
- Make sure `index.js` is in the project root (not in a folder)
- Check that `npm run build` completes successfully first

### Error: "out/index.html not found"
- Run `npm run build` to generate the `/out` directory
- The export command automatically creates it after the build

### Error: Icon not found
- Convert `public/icon.png` to `public/icon.ico`
- Use: https://convertio.co/png-ico/
- Save the .ico file to the exact path: `public/icon.ico`

### App won't launch from installer
- Try the portable version: `Trading Journal.exe` in `dist/`
- Check that all dependencies installed with `npm install`

## Next Steps

1. **Convert icon**: PNG → ICO (one-time)
2. **Run**: `npm run electron-build-win`
3. **Find app**: Look in `dist/` folder
4. **Install**: Double-click the installer or portable .exe

Your Trading Journal desktop app is ready to build and distribute!
