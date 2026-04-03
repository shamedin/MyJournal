@echo off
REM Fix build errors and create desktop app for Windows

echo.
echo ========================================
echo   Fixing Build Issues & Building App
echo ========================================
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run SIMPLE_SETUP.bat first
    pause
    exit /b 1
)

REM Clean up problematic files
echo Cleaning build cache...
if exist ".next" rmdir /s /q .next >nul 2>&1
if exist "dist" rmdir /s /q dist >nul 2>&1
if exist ".turbo" rmdir /s /q .turbo >nul 2>&1

REM Clear npm cache to avoid stale data
echo Clearing npm cache...
call npm cache clean --force >nul 2>&1

echo.
echo Building Next.js application (using SWC, not Turbopack)...
echo This may take 3-5 minutes...
echo.

REM Build with increased Node memory to prevent allocation errors
set NODE_OPTIONS=--max-old-space-size=4096

call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed
    echo.
    echo Trying alternative approach...
    echo.
    call npm run build -- --no-lint
    
    if errorlevel 1 (
        echo.
        echo Build still failed. Possible solutions:
        echo.
        echo 1. Close other programs to free up RAM
        echo 2. Move your project to C:\MyProjects\TradingJournal
        echo    (simpler path = fewer issues)
        echo 3. Check the error messages above
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Next.js build successful!
echo.

REM Check if icon exists
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

echo Building Electron desktop app...
echo This may take 2-5 minutes...
echo.

set NODE_OPTIONS=--max-old-space-size=4096

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
