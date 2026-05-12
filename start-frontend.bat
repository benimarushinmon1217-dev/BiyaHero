@echo off
echo ========================================
echo   BiyaHero Frontend Only
echo ========================================
echo.
echo Starting frontend development server...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start frontend only
call npm run dev:frontend-only

pause
