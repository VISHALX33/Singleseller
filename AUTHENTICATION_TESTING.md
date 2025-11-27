/**
 * Authentication API Testing Guide
 * Quick reference for testing auth endpoints
 */

// ============================================
// TEST 1: Register New User
// ============================================

POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "TestPass123!",
  "phone": "9876543210"
}

// Expected Response (201):
// {
//   "success": true,
//   "message": "Registration successful. Welcome to SingleSeller!",
//   "data": {
//     "user": { id, name, email, phone, role: "customer", avatar, createdAt },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//   }
// }

// ============================================
// TEST 2: Login User
// ============================================

POST /api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "TestPass123!"
}

// Expected Response (200):
// {
//   "success": true,
//   "message": "Login successful. Welcome back!",
//   "data": {
//     "user": { ... },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//   }
// }
// Save this token for protected route testing

// ============================================
// TEST 3: Get User Profile (Protected)
// ============================================

GET /api/auth/profile
Authorization: Bearer <token_from_login>

// Expected Response (200):
// {
//   "success": true,
//   "message": "Profile retrieved successfully.",
//   "data": {
//     "user": {
//       "id": "...",
//       "name": "Test User",
//       "email": "testuser@example.com",
//       "phone": "9876543210",
//       "role": "customer",
//       "avatar": null,
//       "addresses": [],
//       "isEmailVerified": false,
//       "createdAt": "...",
//       "updatedAt": "..."
//     }
//   }
// }

// ============================================
// TEST 4: Update Profile (Protected)
// ============================================

PUT /api/auth/profile
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543211",
  "avatar": "https://example.com/avatar.jpg"
}

// Expected Response (200):
// {
//   "success": true,
//   "message": "Profile updated successfully.",
//   "data": { "user": { ... } }
// }

// ============================================
// TEST 5: Change Password (Protected)
// ============================================

PUT /api/auth/change-password
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "oldPassword": "TestPass123!",
  "newPassword": "NewTestPass456!",
  "confirmPassword": "NewTestPass456!"
}

// Expected Response (200):
// {
//   "success": true,
//   "message": "Password changed successfully. Please login with your new password."
// }

// After changing password, login with new password:
// POST /api/auth/login
// { "email": "testuser@example.com", "password": "NewTestPass456!" }

// ============================================
// TEST 6: Logout
// ============================================

POST /api/auth/logout

// Expected Response (200):
// {
//   "success": true,
//   "message": "Logout successful. Please remove token from client storage."
// }

// ============================================
// ERROR TESTING
// ============================================

// Test 1: Invalid Email on Login
POST /api/auth/login
{
  "email": "nonexistent@example.com",
  "password": "TestPass123!"
}
// Expected (401): "Invalid email or password"

// Test 2: Weak Password on Register
POST /api/auth/register
{
  "name": "Test",
  "email": "test@example.com",
  "password": "weak123"
}
// Expected (400): "Password must contain uppercase, lowercase, number, special char"

// Test 3: Missing Authorization Header
GET /api/auth/profile
// Expected (401): "No authorization token provided"

// Test 4: Invalid Token
GET /api/auth/profile
Authorization: Bearer invalid.token.here
// Expected (401): "Invalid token"

// Test 5: Duplicate Email Registration
POST /api/auth/register
{
  "name": "Another User",
  "email": "testuser@example.com",
  "password": "AnotherPass123!"
}
// Expected (409): "Email already registered"

// Test 6: Wrong Old Password
PUT /api/auth/change-password
Authorization: Bearer <token>
{
  "oldPassword": "WrongPassword123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
// Expected (401): "Current password is incorrect"

// ============================================
// USING WITH POSTMAN
// ============================================

/*
1. Create a new Postman Collection: "Authentication API"

2. Add Environment Variables:
   - base_url: http://localhost:5000
   - token: (leave empty, will auto-fill after login)

3. Create requests in this order:

Request 1: Register
- Method: POST
- URL: {{base_url}}/api/auth/register
- Body (JSON):
  {
    "name": "Test User",
    "email": "postman-test@example.com",
    "password": "PostmanPass123!",
    "phone": "9876543210"
  }
- Tests (add this to capture token):
  if (pm.response.code === 201) {
    pm.environment.set("token", pm.response.json().data.token);
  }

Request 2: Login
- Method: POST
- URL: {{base_url}}/api/auth/login
- Body (JSON):
  {
    "email": "postman-test@example.com",
    "password": "PostmanPass123!"
  }
- Tests:
  if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().data.token);
  }

Request 3: Get Profile
- Method: GET
- URL: {{base_url}}/api/auth/profile
- Headers:
  Authorization: Bearer {{token}}

Request 4: Update Profile
- Method: PUT
- URL: {{base_url}}/api/auth/profile
- Headers:
  Authorization: Bearer {{token}}
- Body (JSON):
  {
    "name": "Updated Test User",
    "phone": "9876543211"
  }

Request 5: Change Password
- Method: PUT
- URL: {{base_url}}/api/auth/change-password
- Headers:
  Authorization: Bearer {{token}}
- Body (JSON):
  {
    "oldPassword": "PostmanPass123!",
    "newPassword": "NewPostmanPass456!",
    "confirmPassword": "NewPostmanPass456!"
  }

4. Run tests sequentially:
   - Register → Copy token
   - Login → Auto-copy token
   - Get Profile (using token)
   - Update Profile (using token)
   - Change Password (using token)
*/

// ============================================
// USING WITH CURL
// ============================================

/*
# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Curl Test User",
    "email": "curl-test@example.com",
    "password": "CurlPass123!",
    "phone": "9876543210"
  }'

# Save token from response, then use it:

# Get Profile
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Profile
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Curl User",
    "phone": "9876543211"
  }'

# Change Password
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "CurlPass123!",
    "newPassword": "NewCurlPass456!",
    "confirmPassword": "NewCurlPass456!"
  }'

# Logout
curl -X POST http://localhost:5000/api/auth/logout
*/

// ============================================
// VALIDATION RULES QUICK REFERENCE
// ============================================

/*
REGISTER/UPDATE VALIDATION:

Name:
- Min 2, Max 50 characters
- Letters and spaces only
- Example: "John Doe" ✓, "J" ✗, "John123" ✗

Email:
- Valid email format
- Automatically normalized to lowercase
- Example: "user@example.com" ✓, "invalid-email" ✗

Phone:
- Optional
- 10 digits, starts with 6-9 (Indian format)
- Example: "9876543210" ✓, "123456" ✗, "12345678901" ✗

Password (Registration only):
- Min 6, Max 50 characters
- At least 1 uppercase (A-Z)
- At least 1 lowercase (a-z)
- At least 1 number (0-9)
- At least 1 special char (@$!%*?&)
- Example: "SecurePass123!" ✓, "password123" ✗, "Pass12" ✗

Old Password (Change Password):
- Must match current password
- Used to verify identity before allowing change

New Password (Change Password):
- Must meet strength requirements
- Must be different from old password
- Must match confirmPassword field
*/

// ============================================
// TOKEN INFORMATION
// ============================================

/*
JWT TOKEN STRUCTURE:

Headers: Authorization: Bearer <token>

Token Contains:
- id: User's MongoDB _id
- email: User's email
- role: User's role (customer/admin)
- iat: Issued at timestamp
- exp: Expiration timestamp (7 days from issue)

Token Validation:
- Valid for 7 days
- Can be verified offline using JWT_SECRET
- Send in Authorization header as: Bearer <token>
- If expired, user must login again

Token NOT stored on server:
- Stateless authentication
- Verify using JWT_SECRET each time
- To logout, client removes from localStorage
*/
