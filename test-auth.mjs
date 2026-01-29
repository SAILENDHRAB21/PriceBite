// Test script to verify JWT authentication is working
// Run this with: node test-auth.js (after adding type: module to package.json or rename to .mjs)

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing JWT Authentication...\n');

  // Test 1: Register a new user
  console.log('1️⃣ Testing Registration...');
  try {
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`, // Unique email
        password: 'test123456'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Registration:', registerData.success ? 'SUCCESS' : 'FAILED');
    
    if (registerData.token) {
      console.log('✅ JWT Token received:', registerData.token.substring(0, 20) + '...');
      
      // Test 2: Verify token
      console.log('\n2️⃣ Testing Token Verification...');
      const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${registerData.token}`
        }
      });
      
      const verifyData = await verifyResponse.json();
      console.log('✅ Token Verification:', verifyData.success ? 'SUCCESS' : 'FAILED');
      
      // Test 3: Get protected profile
      console.log('\n3️⃣ Testing Protected Route...');
      const profileResponse = await fetch(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${registerData.token}`
        }
      });
      
      const profileData = await profileResponse.json();
      console.log('✅ Protected Route:', profileData.success ? 'SUCCESS' : 'FAILED');
      console.log('👤 User Data:', profileData.user);
    }
    
    // Test 4: Login with credentials
    console.log('\n4️⃣ Testing Login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.user.email,
        password: 'test123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login:', loginData.success ? 'SUCCESS' : 'FAILED');
    
    // Test 5: Wrong password
    console.log('\n5️⃣ Testing Wrong Password...');
    const wrongPassResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.user.email,
        password: 'wrongpassword'
      })
    });
    
    const wrongPassData = await wrongPassResponse.json();
    console.log('✅ Wrong Password:', !wrongPassData.success ? 'REJECTED (CORRECT)' : 'FAILED (SECURITY ISSUE)');
    
    console.log('\n✨ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testAuth();
