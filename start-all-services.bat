@echo off
title PriceBite Services

echo ========================================
echo   Starting PriceBite Services
echo ========================================
echo.

REM Start Python AI Service in new window
echo [1/2] Starting Python GROQ AI Service...
start "GROQ AI (Port 5001)" cmd /k "cd /d %~dp0server\services && python groq_pricing.py"
timeout /t 3 /nobreak >nul

REM Start Node Server in new window  
echo [2/2] Starting Node.js Server...
start "Node Server (Port 5000)" cmd /k "cd /d %~dp0 && npm run server"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo GROQ AI Service: http://localhost:5001
echo Node.js Server:  http://localhost:5000
echo Frontend:        http://localhost:5173
echo.
echo Check the opened windows for service logs.
echo Close those windows to stop the services.
echo.
pause
