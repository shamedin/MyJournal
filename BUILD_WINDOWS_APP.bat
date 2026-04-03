@echo off
REM Trading Journal - Windows Desktop App Builder
REM One-click build for Electron + Next.js static export

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Trading Journal Desktop App Builder
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Download from: https://nodejs.org/
    echo Remember to add to PATH during installation
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check icon
if not exist "public\icon.ico" (
    echo WARNING: App icon not found at public\icon.ico
    echo.
    echo To convert your icon:
    echo 1. Go to: https://convertio.co/png-ico/
    echo 2. Upload: public\icon.png
    echo 3. Download as .ico format
    echo 4. Save to: public\icon.ico
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

echo.
echo Building Next.js application...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Building Windows desktop app...
echo This may take 2-5 minutes...
echo.
call npm run electron-build-win

if errorlevel 1 (
    echo ERROR: Electron build failed
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD COMPLETE!
echo ========================================
echo.
echo Your desktop apps are ready in: dist\
echo.
echo Files created:
echo   - Trading Journal Setup.exe (installer)
echo   - Trading Journal.exe (portable)
echo.
echo Double-click either file to launch your app!
echo.
pause
