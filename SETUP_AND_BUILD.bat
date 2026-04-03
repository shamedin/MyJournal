@echo off
setlocal enabledelayedexpansion

color 0A
title Trading Journal Desktop App Setup

echo.
echo ========================================
echo Trading Journal Desktop App Builder
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

echo Node.js found:
node --version

REM Clean npm cache
echo.
echo Cleaning npm cache...
call npm cache clean --force

REM Set npm registry (use Taobao mirror for better connectivity)
echo Setting npm registry...
call npm config set registry https://registry.npmjs.org/

REM Install dependencies with retry
echo.
echo Installing dependencies... (This may take 5-10 minutes)
echo If this fails, the script will retry automatically.
echo.

setlocal enabledelayedexpansion
set retry=0
:retry_install

if !retry! gtr 0 (
    echo.
    echo Retry attempt !retry! of 3...
    timeout /t 5
)

call npm install --legacy-peer-deps
if errorlevel 1 (
    set /a retry=retry+1
    if !retry! lss 3 (
        echo Installation failed, retrying...
        goto retry_install
    ) else (
        echo.
        echo ERROR: Failed to install dependencies after 3 attempts
        echo.
        echo TROUBLESHOOTING:
        echo 1. Check your internet connection
        echo 2. Try disabling antivirus temporarily
        echo 3. Try running as Administrator
        echo 4. Manual fix: Delete node_modules folder and try again
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Dependencies installed successfully!
echo ========================================
echo.

REM Build Next.js
echo Building Next.js application...
call npm run build
if errorlevel 1 (
    echo ERROR: Next.js build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Your app is ready to run
echo ========================================
echo.
echo Next steps:
echo 1. Make sure you have icon.ico in the public folder
echo    (See ICON_SETUP.md for icon conversion instructions)
echo 2. Run BUILD_DESKTOP_APP.bat to create the installer
echo 3. Or run: npm run electron-build-win
echo.
pause
