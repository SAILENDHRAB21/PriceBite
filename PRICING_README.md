# PriceBite AI Dynamic Pricing

## 🚀 Setup Instructions

### 1. Install Python Dependencies

```bash
cd server/services
pip install -r requirements.txt
```

### 2. Start the AI Pricing Service

**Windows:**
```bash
.\start-pricing-service.bat
```

**Linux/Mac:**
```bash
chmod +x start-pricing-service.sh
./start-pricing-service.sh
```

**Manual:**
```bash
cd server/services
python groq_pricing.py
```

The GROQ AI service will run on **http://localhost:5001**

### 3. Start Node.js Server

```bash
npm run server
```

The Node.js API will run on **http://localhost:5000**

### 4. Start Frontend

```bash
npm run dev
```

The frontend will run on **http://localhost:5173**

## 🤖 How It Works

The AI pricing system uses **GROQ's Llama 3.3 70B** model to analyze:

1. **Weather Conditions** 
   - Rain/Storm: +30-50% price increase
   - Clear weather: Normal pricing
   - Snow: +40% increase

2. **Traffic Levels**
   - High traffic (rush hour): +20-30%
   - Medium traffic: +10-15%
   - Low traffic: -5% discount

3. **Time of Day**
   - Peak hours (lunch/dinner): +10-25%
   - Late night: -10-20% discount
   - Breakfast: Normal/slight discount

4. **Day Type**
   - Weekend peak: +15-25%
   - Weekday: +10-20%

## 📡 API Endpoints

### Calculate Dynamic Pricing
```
POST http://localhost:5000/api/pricing/calculate

Body:
{
  "dishes": [
    {
      "id": "1",
      "name": "Margherita Pizza",
      "price": 349,
      "category": "Pizza"
    }
  ],
  "latitude": 28.6139,
  "longitude": 77.2090
}

Response:
{
  "success": true,
  "data": {
    "multiplier": 1.25,
    "reasoning": "Heavy rain with high traffic during dinner time",
    "dishes": [
      {
        "id": "1",
        "name": "Margherita Pizza",
        "originalPrice": 349,
        "dynamicPrice": 436,
        "multiplier": 1.25,
        "priceChange": "+87",
        "surcharge": 87,
        "savings": 0
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

### Health Check
```
GET http://localhost:5000/api/pricing/health
```

## 🔧 Configuration

Edit `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
WEATHER_API_KEY=your_openweather_api_key (optional)
```

## 📝 Notes

- The AI makes intelligent pricing decisions based on real-time conditions
- Prices are capped between 0.75x (25% discount) and 1.75x (75% increase)
- If GROQ AI fails, it falls back to rule-based pricing
- All prices are rounded to whole numbers for Indian market
