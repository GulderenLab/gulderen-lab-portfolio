@echo off
echo ========================================
echo    RadyolojiHub Web Server Starter
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %cd%
echo.

echo Checking if Python is available...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python found - Starting Python HTTP server...
    echo.
    python start-server.py
    goto :end
)

echo Python not found, checking Node.js...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js found - Starting Node.js HTTP server...
    echo.
    node start-server.js
    goto :end
)

echo.
echo ❌ Neither Python nor Node.js found!
echo.
echo Please install one of the following:
echo 1. Python 3.x from https://python.org
echo 2. Node.js from https://nodejs.org
echo.
echo Alternative: Use PowerShell command:
echo python -m http.server 3000
echo.
pause
goto :end

:end
echo.
echo Press any key to exit...
pause >nul