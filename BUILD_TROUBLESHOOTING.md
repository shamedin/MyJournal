# Build Troubleshooting Guide

## Problem: "memory allocation failed" or Turbopack errors

**Root Cause**: Next.js 16 Turbopack uses too much memory on Windows, especially with complex projects.

**Solution**: We've disabled Turbopack in `next.config.mjs`. It now uses SWC (faster, more reliable).

## What I Fixed

1. ✅ Disabled Turbopack in `next.config.mjs`
2. ✅ Created `FIX_AND_BUILD.bat` with proper memory allocation
3. ✅ Added cache cleaning to prevent stale data
4. ✅ Increased Node.js memory limit to 4GB

## How to Build Now

### Method 1: Quick Build (Recommended)
```
Double-click: FIX_AND_BUILD.bat
```

This script will:
- Clean all build cache
- Build with SWC (more stable)
- Handle memory limits automatically
- Build your desktop app

### Method 2: Manual Build
Open Command Prompt and run:
```batch
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
npx electron-builder --win
```

## If Build Still Fails

Try these steps in order:

### Step 1: Move Project to Simpler Path
Windows handles long paths poorly. Move your project:

**From**: `C:\Users\hp\Downloads\b_K5lgqyWIBoS-1775245500731\`
**To**: `C:\MyProjects\TradingJournal\`

Then run `FIX_AND_BUILD.bat` again.

### Step 2: Delete Node Modules & Reinstall
```batch
rmdir /s /q node_modules
npm cache clean --force
npm install --legacy-peer-deps
```

Then run `FIX_AND_BUILD.bat`.

### Step 3: Close Other Programs
- Close all browsers
- Close all IDEs (VSCode, etc.)
- Close Electron preview windows
- Close antivirus if possible

This frees up RAM for the build process. Try again.

### Step 4: Use Clean Build
```batch
cd C:\YourProjectPath
set NODE_OPTIONS=--max-old-space-size=8192
npm run build -- --no-lint
```

The `--max-old-space-size=8192` doubles the memory limit.

## Common Build Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ENOENT: no such file or directory` | Missing public/icon.ico | Convert PNG to ICO at convertio.co |
| `ERR! code ETIMEDOUT` | Network dropped | Run `FIX_AND_BUILD.bat` again |
| `memory allocation failed` | Not enough RAM | Close programs, move to simpler path |
| `Failed to build app` | Electron not installed | Run `npm install --legacy-peer-deps` |

## Icon Setup

**You need public/icon.ico for Windows builds!**

1. Go to https://convertio.co/png-ico/
2. Upload `public/icon.png` (we created this)
3. Download as ICO file
4. Save to `public/icon.ico`
5. Run `FIX_AND_BUILD.bat`

## Test Before Building Desktop App

To test your app works before building:

```batch
Double-click: START_DEV_MODE.bat
```

Opens at http://localhost:3000. If this works, the desktop app will work too.

## Success!

After `FIX_AND_BUILD.bat` finishes without errors:

1. Go to `dist/` folder in your project
2. You'll see:
   - `Trading Journal Setup.exe` - Full installer
   - `Trading Journal.exe` - Portable version (no installation)

3. Double-click either to install/run your desktop app!

## Need More Help?

If you're still stuck:

1. **Check error messages** - They're usually descriptive
2. **Check this guide** - Most issues are covered above
3. **Try the manual method** - Sometimes manual commands work when scripts don't
4. **Move to simpler path** - `C:\MyProjects\Trading` not deep nested paths

Good luck! 🚀
