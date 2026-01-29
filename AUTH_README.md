# PriceBite - JWT & Bcrypt Authentication

This project now uses JWT (JSON Web Tokens) and bcrypt for secure authentication.

## 🔐 Authentication Features

- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Bcrypt Password Hashing**: Industry-standard password encryption
- **Protected Routes**: Token verification for secure endpoints
- **Persistent Sessions**: Tokens stored in localStorage

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The `.env` file contains:
```env
VITE_GEOAPIFY_API_KEY=11cf02c4765349d29ad73ab51ee6c44d
VITE_API_URL=http://localhost:5000/api

# Backend variables
JWT_SECRET=pricebite-super-secret-jwt-key-change-in-production-2026
PORT=5000
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

### 3. Run the Application

#### Option A: Run Frontend & Backend Together (Recommended)
```bash
npm run dev:all
```
This starts:
- Frontend on http://localhost:5173
- Backend API on http://localhost:5000

#### Option B: Run Separately
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/verify` - Verify JWT token (requires Authorization header)

### Protected Routes
- `GET /api/user/profile` - Get user profile (requires Authorization header)

### Authorization Header Format
```
Authorization: Bearer <your-jwt-token>
```

## 🏗️ Architecture

### Backend (`server/server.ts`)
- Express.js server with TypeScript
- JWT token generation and verification
- Bcrypt password hashing (10 salt rounds)
- In-memory user storage (replace with database for production)
- CORS enabled for frontend communication

### Frontend (`src/services/authService.ts`)
- Centralized authentication service
- Token management in localStorage
- API communication with proper headers
- Error handling and user feedback

### Context Integration (`src/context/AppContext.tsx`)
- Global user state management
- Automatic token cleanup on logout
- Redirect to login on logout

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds) before storage
2. **JWT Tokens**: 7-day expiration, signed with secret key
3. **Token Validation**: Protected routes verify token before access
4. **CORS**: Configured to allow frontend-backend communication
5. **No Password Exposure**: Passwords never returned in API responses

## 📝 Testing Authentication

### Test User Registration
1. Open the app at http://localhost:5173
2. Register a new account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

### Test User Login
1. Login with the registered credentials
2. Token is automatically stored in localStorage
3. Location is fetched and restaurants are loaded

### Check Token in Browser
```javascript
// Open browser console
localStorage.getItem('authToken')
```

## 🔧 Development Notes

### User Storage
Currently uses in-memory array. For production:
- Add MongoDB/PostgreSQL database
- Create User model/schema
- Add database connection
- Implement proper user queries

### Recommended Improvements
- Add refresh tokens for better security
- Implement password reset functionality
- Add email verification
- Rate limiting for API endpoints
- Add request validation middleware
- Use environment-specific configs

## 📦 Dependencies Added

### Backend
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `jsonwebtoken` - JWT token generation/verification
- `bcryptjs` - Password hashing
- `dotenv` - Environment variable management
- `ts-node` - TypeScript execution
- `nodemon` - Auto-reload during development

### Frontend
- `authService` - Centralized auth API client

## 🐛 Troubleshooting

### "Network error" on login/register
- Make sure backend server is running on port 5000
- Check VITE_API_URL in .env file
- Verify CORS is enabled in server

### "Invalid token" error
- Token may have expired (7 days)
- Clear localStorage and login again
- Check JWT_SECRET matches between requests

### Server won't start
```bash
# Kill process on port 5000
npx kill-port 5000

# Then restart
npm run server
```

## 📚 Learn More

- [JWT.io](https://jwt.io/) - Learn about JSON Web Tokens
- [bcrypt](https://www.npmjs.com/package/bcryptjs) - Password hashing library
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
