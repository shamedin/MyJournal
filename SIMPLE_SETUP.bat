@echo off
REM Simple and Reliable Desktop App Setup Script
REM This script handles npm installation with better error recovery

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Trading Journal Desktop App Setup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if node_modules exists and has issues
if exist "node_modules" (
    echo Cleaning up broken node_modules...
    echo This may take a moment...
    rmdir /s /q node_modules 2>nul
    if exist "node_modules" (
        echo WARNING: Could not delete node_modules automatically
        echo Please:
        echo   1. Close VSCode completely
        echo   2. Close Windows Explorer windows
        echo   3. Temporarily disable antivirus
        echo   4. Manually delete the node_modules folder
        echo   5. Run this script again
        pause
        exit /b 1
    )
    echo node_modules cleaned successfully
)

REM Clear npm cache
echo Clearing npm cache...
call npm cache clean --force 2>nul

REM Configure npm for better reliability
echo Configuring npm settings...
call npm config set fetch-timeout 120000 2>nul
call npm config set fetch-retry-mintimeout 20000 2>nul
call npm config set fetch-retry-maxtimeout 120000 2>nul
call npm config set fetch-retries 5 2>nul

REM Install dependencies with best practices
echo.
echo Installing dependencies...
echo This may take 5-15 minutes. Please be patient...
echo.

call npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund

REM Check if installation succeeded
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    echo.
    echo Try these fixes in order:
    echo 1. Delete node_modules folder manually
    echo 2. Close all programs (VSCode, Explorer, antivirus)
    echo 3. Run: npm cache clean --force
    echo 4. Run this script again
    echo.
    echo If it still fails, your network may have issues.
    echo Try on a different WiFi or wired connection.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencies installed successfully!
echo ========================================
echo.

REM Check if dependencies installed correctly
if not exist "node_modules\.bin\next" (
    echo ERROR: Next.js did not install properly
    echo Retrying installation...
    call npm install --legacy-peer-deps --no-audit
)

echo.
echo Setup complete! Next steps:
echo.
echo For DEVELOPMENT (testing before building):
echo   Double-click: START_DEV_MODE.bat
echo.
echo For PRODUCTION (building the desktop app):
echo   Double-click: BUILD_DESKTOP_APP.bat
echo.
pause
