@echo off
echo ========================================
echo   Starting PriceBite AI Pricing System
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo [1/3] Installing Python dependencies...
cd server\services
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python packages
    pause
    exit /b 1
)

echo.
echo [2/3] Starting GROQ AI Pricing Service on port 5001...
start "GROQ Pricing AI" cmd /k "python groq_pricing.py"

echo.
echo [3/3] Waiting 3 seconds for service to start...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   ✓ Services Started Successfully!
echo ========================================
echo.
echo GROQ AI Service: http://localhost:5001
echo Node.js Server: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
