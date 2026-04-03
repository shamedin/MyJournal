@echo off
REM Build the Electron desktop app for Windows

echo.
echo ========================================
echo   Building Desktop App for Windows
echo ========================================
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run SIMPLE_SETUP.bat first
    pause
    exit /b 1
)

REM Check if icon exists (required for Windows build)
if not exist "public\icon.ico" (
    echo.
    echo WARNING: App icon not found at public\icon.ico
    echo.
    echo To fix this:
    echo 1. Go to https://convertio.co/png-ico/
    echo 2. Upload: public\icon.png
    echo 3. Download as .ico
    echo 4. Save to: public\icon.ico
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo Building Next.js application...
call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo Building Electron desktop app...
echo This may take 2-5 minutes...
echo.

call npx electron-builder --win

if errorlevel 1 (
    echo.
    echo ERROR: Desktop app build failed
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Your app is ready in: dist\
echo.
echo You'll find:
echo   - Trading Journal Setup.exe (installer)
echo   - Trading Journal.exe (portable version)
echo.
echo Double-click either .exe to install or run your desktop app!
echo.
pause
