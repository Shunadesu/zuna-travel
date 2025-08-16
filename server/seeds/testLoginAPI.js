const axios = require('axios');

const testLoginAPI = async () => {
  try {
    console.log('🧪 Testing Login API...');
    
    const API_BASE_URL = 'https://zuna-travel.onrender.com';
    
    // Test data
    const loginData = {
      email: 'admin@gmail.com',
      password: 'admin123'
    };

    console.log('📧 Login data:', loginData);
    console.log('🌐 API URL:', `${API_BASE_URL}/auth/login`);

    // Make login request
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login successful!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', {
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
      token: response.data.token ? 'Token received' : 'No token',
      tokenLength: response.data.token ? response.data.token.length : 0
    });

    // Test with wrong password
    console.log('\n🧪 Testing with wrong password...');
    try {
      const wrongResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@gmail.com',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected wrong password');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test with non-existent email
    console.log('\n🧪 Testing with non-existent email...');
    try {
      const nonExistentResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'nonexistent@gmail.com',
        password: 'admin123'
      });
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected non-existent email');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
  }
};

// Run the test
testLoginAPI();
