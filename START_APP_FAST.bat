@echo off
REM Trading Journal - Fast Production Launcher
REM Use this for faster startup (requires npm run build to be run first)

echo Starting Trading Journal (Production Mode - Faster)...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please run START_APP.bat first to set up
    pause
    exit /b 1
)

REM Check if build exists
if not exist ".next" (
    echo Production build not found. Building...
    call npm run build
    if %ERRORLEVEL% neq 0 (
        echo Build failed. Running in development mode instead...
        start http://localhost:3000
        npm run dev
        exit /b 0
    )
)

echo Starting production server (faster startup)...
echo Your app will open at http://localhost:3000
echo.
echo To stop the app, press Ctrl+C in this window
echo.

start http://localhost:3000
npm run start

pause
