@echo off
REM Trading Journal - Desktop App Launcher for Windows
REM This script starts the app and opens it in your default browser

echo Starting Trading Journal Desktop App...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to add Node.js to PATH during installation
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo First time setup - installing dependencies...
    echo This may take a few minutes...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Start the app
echo Starting development server...
echo Your app will open automatically at http://localhost:3000
echo.
echo To stop the app, press Ctrl+C in this window
echo.

start http://localhost:3000
npm run dev

pause
