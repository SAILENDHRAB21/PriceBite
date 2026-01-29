import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

class GroqPricingAI:
    def __init__(self):
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=api_key)
        self.weather_api_key = os.getenv('WEATHER_API_KEY', '')
        
    def get_weather_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Fetch weather data"""
        try:
            if self.weather_api_key:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={self.weather_api_key}&units=metric"
                response = requests.get(url, timeout=5)
                data = response.json()
                
                weather_main = data['weather'][0]['main'].lower()
                condition = 'clear'
                if 'rain' in weather_main:
                    condition = 'rain'
                elif 'storm' in weather_main or 'thunder' in weather_main:
                    condition = 'storm'
                elif 'snow' in weather_main:
                    condition = 'snow'
                    
                return {
                    'condition': condition,
                    'temperature': data['main']['temp'],
                    'description': data['weather'][0]['description'],
                    'humidity': data['main']['humidity']
                }
        except Exception as e:
            print(f"Weather API error: {e}")
        
        # Simulate weather based on time for demo
        hour = datetime.now().hour
        if 14 <= hour <= 17:
            return {'condition': 'rain', 'temperature': 28, 'description': 'Light rain', 'humidity': 80}
        return {'condition': 'clear', 'temperature': 25, 'description': 'Clear sky', 'humidity': 60}
    
    def get_time_factors(self) -> Dict[str, Any]:
        """Get current time-based factors"""
        now = datetime.now()
        hour = now.hour
        day_of_week = now.weekday()
        
        # Determine time of day
        if 6 <= hour < 11:
            time_of_day = 'breakfast'
        elif 11 <= hour < 16:
            time_of_day = 'lunch'
        elif 16 <= hour < 22:
            time_of_day = 'dinner'
        else:
            time_of_day = 'late-night'
        
        # Determine day type
        day_type = 'weekend' if day_of_week >= 5 else 'weekday'
        
        # Simulate traffic based on time
        if (8 <= hour <= 10) or (17 <= hour <= 19):
            traffic = 'high'
            traffic_description = 'Heavy traffic - rush hour'
        elif 11 <= hour <= 16:
            traffic = 'medium'
            traffic_description = 'Moderate traffic'
        else:
            traffic = 'low'
            traffic_description = 'Light traffic'
        
        return {
            'hour': hour,
            'time_of_day': time_of_day,
            'day_type': day_type,
            'traffic': traffic,
            'traffic_description': traffic_description
        }
    
    def calculate_dynamic_pricing(
        self,
        dishes: List[Dict[str, Any]],
        latitude: float,
        longitude: float
    ) -> Dict[str, Any]:
        """Use GROQ AI to calculate dynamic pricing"""
        
        # Get real-time data
        weather = self.get_weather_data(latitude, longitude)
        time_factors = self.get_time_factors()
        
        # Prepare context for AI
        dishes_str = json.dumps([{'id': str(d.get('id', '')), 'name': str(d.get('name', '')), 'price': int(d.get('price', 0)), 'category': str(d.get('category', 'food'))} for d in dishes], indent=2)
        
        context = f"""You are a dynamic pricing AI expert for a food delivery service in India. Analyze the following real-time conditions and provide intelligent pricing adjustments.

CURRENT CONDITIONS:
Weather: {weather['condition']} ({weather['description']})
Temperature: {weather['temperature']}°C
Humidity: {weather['humidity']}%
Time: {time_factors['time_of_day']} ({time_factors['hour']}:00)
Day: {time_factors['day_type']}
Traffic: {time_factors['traffic']} ({time_factors['traffic_description']})

DISHES TO PRICE:
{dishes_str}

PRICING RULES:
1. Heavy Rain/Storm: +30-50% (difficult delivery, driver safety)
2. Light Rain: +15-25% (slower delivery)
3. High Traffic: +20-30% (longer delivery time)
4. Medium Traffic: +10-15%
5. Peak Hours (lunch/dinner weekday): +10-20%
6. Weekend dinner: +15-25%
7. Late night: -10-20% (low demand)
8. Hot weather (>35°C): +5-10% (drinks and cold items)
9. Pleasant weather + low traffic: -5-15% (discount to boost orders)

CONSTRAINTS:
- Minimum multiplier: 0.75 (25% discount max)
- Maximum multiplier: 1.75 (75% increase max)
- Keep prices reasonable for Indian market
- Price must be whole numbers (round final price)

Respond with ONLY a valid JSON object (no markdown, no explanation):
{{
  "multiplier": 1.25,
  "reasoning": "Brief explanation of pricing decision based on conditions",
  "dishes": [
    {{
      "id": "1",
      "name": "Margherita Pizza",
      "originalPrice": 349,
      "dynamicPrice": 419,
      "multiplier": 1.20,
      "priceChange": "+70"
    }}
  ],
  "factors": {{
    "weather_impact": 0.20,
    "traffic_impact": 0.15,
    "time_impact": 0.10,
    "demand_impact": 0.05
  }},
  "conditions_summary": "Heavy rain with high traffic during dinner time - prices increased to compensate delivery challenges"
}}"""
        
        try:
            # Call GROQ AI
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a pricing expert AI. Respond ONLY with valid JSON. No markdown formatting, no code blocks, no explanations outside JSON."
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.5,
                max_tokens=3000,
                response_format={"type": "json_object"}
            )
            
            # Parse AI response
            ai_response = chat_completion.choices[0].message.content
            pricing_data = json.loads(ai_response)
            
            # Validate and sanitize prices
            for dish in pricing_data.get('dishes', []):
                dish['dynamicPrice'] = int(round(dish['dynamicPrice']))
                dish['originalPrice'] = int(dish['originalPrice'])
                
                # Calculate savings or surcharge
                diff = dish['dynamicPrice'] - dish['originalPrice']
                if diff > 0:
                    dish['surcharge'] = diff
                    dish['savings'] = 0
                else:
                    dish['savings'] = abs(diff)
                    dish['surcharge'] = 0
            
            # Add context data
            pricing_data['weather'] = weather
            pricing_data['time_factors'] = time_factors
            pricing_data['timestamp'] = datetime.now().isoformat()
            
            return {
                'success': True,
                'data': pricing_data
            }
            
        except Exception as e:
            print(f"GROQ AI Error: {e}")
            # Fallback to rule-based pricing
            return self.fallback_pricing(dishes, weather, time_factors)
    
    def fallback_pricing(
        self,
        dishes: List[Dict[str, Any]],
        weather: Dict[str, Any],
        time_factors: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Fallback rule-based pricing if AI fails"""
        
        multiplier = 1.0
        reasoning_parts = []
        factors = {
            'weather_impact': 0.0,
            'traffic_impact': 0.0,
            'time_impact': 0.0,
            'demand_impact': 0.0
        }
        
        # Weather impact
        if weather['condition'] == 'storm':
            multiplier *= 1.5
            factors['weather_impact'] = 0.50
            reasoning_parts.append("50% increase due to storm")
        elif weather['condition'] == 'rain':
            multiplier *= 1.3
            factors['weather_impact'] = 0.30
            reasoning_parts.append("30% increase due to rain")
        elif weather['condition'] == 'snow':
            multiplier *= 1.4
            factors['weather_impact'] = 0.40
            reasoning_parts.append("40% increase due to snow")
        
        # Traffic impact
        if time_factors['traffic'] == 'high':
            multiplier *= 1.25
            factors['traffic_impact'] = 0.25
            reasoning_parts.append("25% increase for high traffic")
        elif time_factors['traffic'] == 'medium':
            multiplier *= 1.1
            factors['traffic_impact'] = 0.10
            reasoning_parts.append("10% increase for medium traffic")
        
        # Time impact
        if time_factors['time_of_day'] in ['lunch', 'dinner']:
            if time_factors['day_type'] == 'weekend':
                multiplier *= 1.15
                factors['time_impact'] = 0.15
                reasoning_parts.append("15% increase for weekend peak hours")
            else:
                multiplier *= 1.1
                factors['time_impact'] = 0.10
                reasoning_parts.append("10% increase for weekday peak hours")
        elif time_factors['time_of_day'] == 'late-night':
            multiplier *= 0.9
            factors['demand_impact'] = -0.10
            reasoning_parts.append("10% discount for late night")
        
        # Cap multiplier
        multiplier = max(0.75, min(1.75, multiplier))
        
        # Apply to dishes
        priced_dishes = []
        for dish in dishes:
            original_price = int(dish.get('price', 299))
            dynamic_price = int(round(original_price * multiplier))
            price_diff = dynamic_price - original_price
            
            priced_dishes.append({
                'id': dish.get('id', ''),
                'name': dish.get('name', ''),
                'originalPrice': original_price,
                'dynamicPrice': dynamic_price,
                'multiplier': round(multiplier, 2),
                'priceChange': f"+{price_diff}" if price_diff > 0 else str(price_diff),
                'surcharge': price_diff if price_diff > 0 else 0,
                'savings': abs(price_diff) if price_diff < 0 else 0
            })
        
        conditions_summary = ' | '.join(reasoning_parts) if reasoning_parts else 'Normal pricing conditions'
        
        return {
            'success': True,
            'data': {
                'multiplier': round(multiplier, 2),
                'reasoning': conditions_summary,
                'dishes': priced_dishes,
                'factors': factors,
                'conditions_summary': conditions_summary,
                'weather': weather,
                'time_factors': time_factors,
                'timestamp': datetime.now().isoformat()
            }
        }


# Create Flask API
app = Flask(__name__)
CORS(app)

pricing_ai = GroqPricingAI()

@app.route('/api/pricing/calculate', methods=['POST'])
def calculate_pricing():
    try:
        data = request.json
        dishes = data.get('dishes', [])
        latitude = data.get('latitude', 28.6139)  # Default: Delhi
        longitude = data.get('longitude', 77.2090)
        
        if not dishes:
            return jsonify({
                'success': False,
                'error': 'No dishes provided'
            }), 400
        
        result = pricing_ai.calculate_dynamic_pricing(dishes, latitude, longitude)
        return jsonify(result)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/pricing/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'service': 'GROQ Pricing AI',
        'timestamp': datetime.now().isoformat(),
        'groq_configured': bool(os.getenv('GROQ_API_KEY'))
    })

if __name__ == '__main__':
    print("🤖 Starting GROQ Pricing AI Service...")
    print(f"✓ GROQ API Key: {'Configured' if os.getenv('GROQ_API_KEY') else 'Missing'}")
    print("🚀 Server running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
