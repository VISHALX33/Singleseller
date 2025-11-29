// Sample API testing script using Node's built-in fetch (Node 18+)
// Run: node testingAPI/sampleTest.js
const baseURL = 'http://localhost:5000/api/health';

(async () => {
  try {
    const res = await fetch(baseURL);
    const data = await res.json();
    console.log('Health endpoint response:', data);
  } catch (err) {
    console.error('API test failed:', err.message);
  }
})();
