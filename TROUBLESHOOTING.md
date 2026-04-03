# Trading Journal Desktop App - Troubleshooting Guide

## Network Error During npm install

**Problem:** `ECONNRESET` or `network read ECONNRESET` error

**This usually means:** Your internet connection was interrupted while downloading packages

### Quick Fixes (Try in order):

#### 1. **Delete and Reinstall (Nuclear Option - Most Effective)**
```bash
# Delete node_modules folder
rmdir /s /q node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install --legacy-peer-deps
```

Or just run: `SETUP_AND_BUILD.bat` (which does this automatically)

#### 2. **Switch npm Registry**
Sometimes the default npm registry is slow or unreliable:

```bash
# Try official registry
npm config set registry https://registry.npmjs.org/

# Or try Taobao mirror (faster in some regions)
npm config set registry https://registry.npmmirror.com/
```

Then retry: `npm install --legacy-peer-deps`

#### 3. **Disable Antivirus Temporarily**
- Some antivirus software blocks npm downloads
- Temporarily disable your antivirus while installing
- Re-enable after installation completes

#### 4. **Run as Administrator**
- Right-click `SETUP_AND_BUILD.bat`
- Select "Run as administrator"
- Try again

#### 5. **Check Your Network**
- Restart your WiFi router
- Try connecting with ethernet cable instead
- Check if you're behind a corporate proxy
  - If so, configure npm proxy: `npm config set proxy [URL]`

#### 6. **Increase npm Timeout**
The download might be timing out. Increase the timeout:
```bash
npm config set fetch-timeout 60000
npm install --legacy-peer-deps
```

---

## Other Common Issues

### "Node.js is not installed"
- Download from https://nodejs.org/ (LTS version)
- **IMPORTANT:** During installation, check the box "Add to PATH"
- Restart your computer after installing
- Verify: Open command prompt and run `node --version`

### "npm command not found"
- Node.js wasn't added to PATH during installation
- Reinstall Node.js and make sure to check "Add to PATH"
- Or manually add Node.js to PATH in Windows settings

### Electron app won't start
- Make sure you have `public/icon.ico` (not just .png)
- See ICON_SETUP.md for converting PNG to ICO
- Check Windows Defender didn't quarantine the exe
- Try running the installer instead of portable exe

### App builds but won't show window
- Check `electron/main.ts` file exists
- Make sure `next build` completed successfully
- Try running in development mode first: `npm run electron-dev`

---

## Development Mode (For Testing)

Want to test before building the installer? Run:

```bash
npm run electron-dev
```

This starts both the Next.js dev server and Electron together. You'll see:
- Live code reloading
- Dev tools (F12 to open)
- Much faster testing cycle

---

## Step-by-Step Recovery

If everything is broken, start fresh:

1. **Delete everything in the project folder EXCEPT these:**
   - `app/` (your app code)
   - `components/` (your components)
   - `public/` (your assets)
   - `pages/` (if you have any)
   - All `.json`, `.ts`, `.js`, `.mjs` config files at root
   - `electron/` folder
   - `.env` files (if you have any)

2. **Delete these folders completely:**
   ```bash
   rmdir /s /q node_modules
   rmdir /s /q .next
   rmdir /s /q dist
   ```

3. **Run fresh install:**
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```

4. **Test development mode:**
   ```bash
   npm run electron-dev
   ```

5. **Then build installer:**
   ```bash
   npm run electron-build-win
   ```

---

## Still Stuck?

If none of these work:

1. Check you have at least 2GB free disk space
2. Make sure you have internet connection
3. Try a different network (mobile hotspot, different WiFi, etc)
4. Try on a different computer if possible
5. Update npm: `npm install -g npm@latest`

Contact Vercel support at vercel.com/help if the issue persists.
