// Test script for GROQ Dynamic Pricing
const testDishes = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 349,
    category: 'Pizza'
  },
  {
    id: '2',
    name: 'Chicken Burger',
    price: 229,
    category: 'Burger'
  },
  {
    id: '3',
    name: 'Paneer Tikka',
    price: 299,
    category: 'Indian'
  }
];

async function testPricing() {
  console.log('🧪 Testing GROQ Dynamic Pricing...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/pricing/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dishes: testDishes,
        latitude: 28.6139,
        longitude: 77.2090
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Pricing calculation successful!\n');
      console.log('📊 Overall Multiplier:', result.data.multiplier);
      console.log('💭 AI Reasoning:', result.data.reasoning);
      console.log('\n🌤️ Weather:', result.data.weather.description, `(${result.data.weather.temperature}°C)`);
      console.log('🚗 Traffic:', result.data.time_factors.traffic_description);
      console.log('⏰ Time:', result.data.time_factors.time_of_day);
      console.log('\n📋 Price Changes:\n');
      
      result.data.dishes.forEach(dish => {
        console.log(`${dish.name}:`);
        console.log(`  Original: ₹${dish.originalPrice}`);
        console.log(`  Dynamic:  ₹${dish.dynamicPrice}`);
        console.log(`  Change:   ${dish.priceChange} (${((dish.multiplier - 1) * 100).toFixed(0)}%)`);
        if (dish.surcharge > 0) {
          console.log(`  Surcharge: ₹${dish.surcharge}`);
        } else if (dish.savings > 0) {
          console.log(`  Savings: ₹${dish.savings}`);
        }
        console.log('');
      });

      console.log('🎯 Impact Factors:');
      console.log(`  Weather Impact: ${(result.data.factors.weather_impact * 100).toFixed(0)}%`);
      console.log(`  Traffic Impact: ${(result.data.factors.traffic_impact * 100).toFixed(0)}%`);
      console.log(`  Time Impact: ${(result.data.factors.time_impact * 100).toFixed(0)}%`);
      console.log(`  Demand Impact: ${(result.data.factors.demand_impact * 100).toFixed(0)}%`);
      
    } else {
      console.log('❌ Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure both services are running:');
    console.log('   1. Python service: python server/services/groq_pricing.py');
    console.log('   2. Node server: npm run server');
  }
}

testPricing();
