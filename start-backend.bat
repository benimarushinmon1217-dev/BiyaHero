@echo off
echo ========================================
echo   BiyaHero Backend Only
echo ========================================
echo.
echo Starting backend development server...
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
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo Checking MySQL connection...
echo Please ensure MySQL is running on localhost:3306
echo.
echo Backend will be available at: http://localhost:5000
echo Health check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start backend only
call npm run dev:backend-only

pause
