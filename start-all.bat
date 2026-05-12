@echo off
echo ========================================
echo   BiyaHero Development Environment
echo ========================================
echo.
echo Starting all services...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo [2/3] Checking MySQL connection...
echo Please ensure MySQL is running on localhost:3306
echo.

echo [3/3] Starting development servers...
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop all servers
echo.

REM Start both servers using npm run dev
call npm run dev

pause
