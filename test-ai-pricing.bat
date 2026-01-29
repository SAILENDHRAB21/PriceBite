@echo off
echo ========================================
echo   Testing GROQ AI Dynamic Pricing
echo ========================================
echo.

echo Step 1: Testing Python AI Service (Port 5001)...
curl http://localhost:5001/api/pricing/health
echo.
echo.

echo Step 2: Testing through Node API (Port 5000)...
echo.
curl -X POST http://localhost:5000/api/pricing/calculate ^
  -H "Content-Type: application/json" ^
  -d "{\"dishes\":[{\"id\":\"1\",\"name\":\"Margherita Pizza\",\"price\":349},{\"id\":\"2\",\"name\":\"Chicken Burger\",\"price\":229}],\"latitude\":28.6139,\"longitude\":77.2090}"

echo.
echo.
echo ========================================
echo   Test Complete!
echo ========================================
pause
