@echo off
REM Trading Journal - Desktop App Builder
REM This script builds your Trading Journal as a Windows desktop application

echo.
echo ========================================
echo  Trading Journal Desktop App Builder
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please download and install Node.js from: https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

echo Node.js found: %nodever%
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies... (This may take a few minutes)
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Building desktop application...
echo This will take 3-10 minutes on first build...
echo.

REM Build the Next.js app and create Windows installer
call npm run electron-build-win

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Your desktop app is ready in the 'dist' folder:
    echo   - Trading-Journal-Setup.exe (Installer)
    echo   - Trading-Journal.exe (Portable)
    echo.
    echo Double-click either file to run or install your app!
    echo.
) else (
    echo.
    echo ERROR: Build failed. Check the messages above.
    echo.
)

pause
