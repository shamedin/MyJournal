@echo off
REM Start the app in development mode for testing

echo.
echo ========================================
echo   Starting Trading Journal (Dev Mode)
echo ========================================
echo.
echo Your app will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the app
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed yet!
    echo Please run SIMPLE_SETUP.bat first
    pause
    exit /b 1
)

REM Start the development server
call npm run dev

pause
