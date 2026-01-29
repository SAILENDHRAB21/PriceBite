# Testing GROQ AI Dynamic Pricing

## Quick Start - Testing in 3 Steps:

### Step 1: Start Services
Run this command to start both services in separate windows:
```bash
.\start-all-services.bat
```

This will open 2 windows:
- **Window 1**: Python GROQ AI Service (Port 5001)
- **Window 2**: Node.js Server (Port 5000)

### Step 2: Wait 5 seconds for services to initialize

### Step 3: Test the AI Pricing

**Option A: Using the test script**
```bash
node test-pricing.mjs
```

**Option B: Using curl (manual test)**
```bash
curl -X POST http://localhost:5000/api/pricing/calculate ^
  -H "Content-Type: application/json" ^
  -d "{\"dishes\":[{\"id\":\"1\",\"name\":\"Pizza\",\"price\":349},{\"id\":\"2\",\"name\":\"Burger\",\"price\":229}],\"latitude\":28.6139,\"longitude\":77.2090}"
```

**Option C: Test Python service directly**
```bash
curl -X POST http://localhost:5001/api/pricing/calculate ^
  -H "Content-Type: application/json" ^
  -d "{\"dishes\":[{\"id\":\"1\",\"name\":\"Pizza\",\"price\":349}],\"latitude\":28.6139,\"longitude\":77.2090}"
```

## Expected Response:

```json
{
  "success": true,
  "data": {
    "multiplier": 1.25,
    "reasoning": "Heavy rain with high traffic during dinner time - prices increased to compensate delivery challenges",
    "dishes": [
      {
        "id": "1",
        "name": "Pizza",
        "originalPrice": 349,
        "dynamicPrice": 436,
        "multiplier": 1.25,
        "priceChange": "+87",
        "surcharge": 87
      }
    ],
    "factors": {
      "weather_impact": 0.30,
      "traffic_impact": 0.25,
      "time_impact": 0.15,
      "demand_impact": 0.05
    },
    "weather": {
      "condition": "rain",
      "temperature": 28,
      "description": "Light rain"
    },
    "time_factors": {
      "time_of_day": "dinner",
      "traffic": "high"
    }
  }
}
```

## Troubleshooting:

**If port 5001 fails:**
- Check if Python is installed: `python --version`
- Check if packages are installed: `pip list | findstr groq`
- Manually start: `cd server/services && python groq_pricing.py`

**If port 5000 fails:**
- Check Node: `node --version`
- Manually start: `npm run server`

**Check if services are running:**
```bash
# Check Python service
curl http://localhost:5001/api/pricing/health

# Check Node service  
curl http://localhost:5000/api/health
```

## How the AI Works:

The GROQ AI (Llama 3.3 70B) analyzes:
1. **Current weather** - Increases price during rain/storm
2. **Traffic conditions** - Higher prices during rush hour
3. **Time of day** - Peak hours get price increase
4. **Demand patterns** - Dynamic based on day/time

The AI provides:
- Intelligent reasoning for price changes
- Individual pricing for each dish
- Breakdown of impact factors
- Weather and traffic conditions
