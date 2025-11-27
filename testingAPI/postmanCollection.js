/**
 * Postman API Testing Collection
 * Import this JSON into Postman to test all endpoints
 * 
 * Steps:
 * 1. Open Postman
 * 2. File > Import > Paste Raw Text
 * 3. Paste the collection below
 * 4. Update environment variables with your actual API URL and token
 */

// Note: This is a template. Create actual requests below.

module.exports = {
  // Example: GET /api/health
  getHealth: {
    method: 'GET',
    url: '{{BASE_URL}}/api/health',
  },
  // Example: GET /api
  getDocumentation: {
    method: 'GET',
    url: '{{BASE_URL}}/api',
  },
};
