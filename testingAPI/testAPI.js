/**
 * API Testing Script
 * Test endpoints using axios
 * 
 * Usage: node testingAPI/testAPI.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Make API request and log response
 */
const makeRequest = async (method, endpoint, data = null) => {
  try {
    console.log(`\n📍 ${method.toUpperCase()} ${API_BASE_URL}${endpoint}`);

    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

/**
 * Run tests
 */
const runTests = async () => {
  console.log('🧪 Starting API Tests...\n');

  // Test health endpoint
  await makeRequest('GET', '/health');

  // Test documentation endpoint
  await makeRequest('GET', '');

  console.log('\n✨ Tests completed!');
};

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { makeRequest };
