# Trading Journal Desktop App - Setup Instructions

## Quick Start (Windows)

### Step 1: Download the Project
1. Download the ZIP file of this project from v0
2. Extract it to a folder on your computer (e.g., `C:\Users\YourName\Documents\TradingJournal`)

### Step 2: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. **IMPORTANT**: During installation, check the box that says "Add to PATH"
5. Click "Install"
6. Verify installation - Open Command Prompt and type: `node --version`

### Step 3: Launch the App
1. Navigate to your project folder in File Explorer
2. Double-click `START_APP.bat` 
3. The app will automatically:
   - Install dependencies (first time only)
   - Start the development server
   - Open in your browser at `http://localhost:3000`

That's it! Your trading journal is now running.

---

## What You Get

✅ **One-Click Launcher** - `START_APP.bat` opens the entire app
✅ **Auto-Start Browser** - Opens automatically to http://localhost:3000
✅ **Fast Development Server** - Hot reload when you edit files
✅ **All Features Ready** - Trading journal, dashboard, reports, and more
✅ **Local Storage** - All your data is stored locally on your computer
✅ **Works Offline** - No internet needed after initial setup

---

## Troubleshooting

### "Node.js is not installed"
- Install Node.js from https://nodejs.org/
- Make sure to check "Add to PATH" during installation
- Restart your computer after installation
- Try `START_APP.bat` again

### Port 3000 Already in Use
- Close the existing app or other programs using port 3000
- Or edit `START_APP.bat` and change the URL to `http://localhost:3001`

### App Won't Start
- Open Command Prompt in your project folder
- Type: `npm install`
- Wait for it to complete
- Try `START_APP.bat` again

---

## Advanced Setup (Production Build for Faster Startup)

For even faster startup times, you can use production mode:

1. Open Command Prompt in your project folder
2. Type: `npm run build`
3. Wait for it to complete
4. Create a new file called `START_PRODUCTION.bat` with this content:

```batch
@echo off
start http://localhost:3000
npm run start
pause
```

5. Double-click `START_PRODUCTION.bat` instead

---

## Project Structure

```
your-project/
├── START_APP.bat              ← Click this to launch!
├── START_PRODUCTION.bat       ← (Optional) Faster startup
├── app/                       ← Main app files
├── components/                ← UI components
├── lib/                       ← Helper functions
├── public/                    ← Static files
└── package.json               ← Project dependencies
```

---

## Features Available

- **Trade Journal** - Log all your trades with details
- **Dashboard** - View performance metrics and statistics
- **Setups Library** - Save and track your trading setups
- **Monthly Reports** - Generate downloadable reports
- **Economic Calendar** - Track market events
- **Statistics** - Detailed performance analysis
- **Dark/Light Mode** - Choose your theme

---

## Need Help?

- Check the browser console (F12) for any errors
- Make sure you're on the latest version of Node.js
- Try clearing your browser cache (Ctrl+Shift+Delete)
- All data is stored locally - it won't be lost

Enjoy your trading journal! 📈

