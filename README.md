# Education App - Full Stack Implementation

## 🚀 Overview
This is a complete education app with React Native frontend and Express.js backend, featuring:
- User authentication (JWT)
- Course management
- Lesson content with multiple types (Theory, Code, Quiz)
- Progress tracking
- SQLite database

## 📁 Project Structure

### Frontend (React Native)
```
education-app/
├── app/                    # Main app screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── profile.tsx    # Profile screen
│   │   └── test-series.tsx # Test series screen
│   └── pages/             # Individual pages
│       ├── CourseDetails.tsx
│       ├── LessonContent.tsx
│       ├── Login.tsx
│       └── UserProfile.tsx
├── services/              # API services
│   ├── apiConfig.ts       # API configuration and types
│   ├── authService.ts     # Authentication service
│   └── courseService.ts   # Course service
└── components/            # Reusable components
```

### Backend (Express.js)
```
education-api/
├── config/
│   └── database.js        # SQLite database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── courseController.js # Course logic
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   └── courses.js         # Course routes
├── services/              # Business logic
├── server.js              # Main server file
└── education.db           # SQLite database file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js v18.20.4 or higher
- npm or yarn
- Expo CLI (for React Native)

### Backend Setup
```bash
cd education-api
npm install
npm run dev
```

The backend will start on `http://localhost:3000`

### Frontend Setup
```bash
cd education-app
npm install
npm start
```

Then scan the QR code with Expo Go app or press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/:courseId/lessons` - Get course lessons (protected)
- `GET /api/courses/:courseId/progress` - Get user progress (protected)
- `POST /api/courses/:courseId/progress` - Update lesson progress (protected)

## 🔐 Authentication
The app uses JWT tokens for authentication:
1. Users register/login to get a token
2. Token is stored in AsyncStorage
3. Token is sent in Authorization header for protected routes
4. Tokens expire after 24 hours

## 📱 Features Implemented

### Frontend
- [x] Tab-based navigation (Home, Profile, Test Series)
- [x] Course listing with cards
- [x] Course details with lesson list
- [x] Interactive lesson content (Theory, Code, Quiz)
- [x] Progress tracking with dots navigation
- [x] User authentication (Login/Register)
- [x] Profile management
- [x] Offline support with fallback data

### Backend
- [x] RESTful API with Express.js
- [x] SQLite database with proper relations
- [x] JWT authentication
- [x] Password hashing with bcrypt
- [x] CORS configuration for mobile apps
- [x] Error handling and validation
- [x] Progress tracking endpoints

## 🛠️ Development Commands

### Backend
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

### Frontend
```bash
npm start      # Start Expo development server
npm run ios    # Start iOS simulator
npm run android # Start Android emulator
npm run web    # Start web version
```

## 🧪 Testing

### Backend API Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test courses endpoint
curl http://localhost:3000/api/courses

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'
```

## 📦 Dependencies

### Frontend
- `expo` - React Native framework
- `react-native-reanimated` - Animations
- `@react-navigation/native` - Navigation
- `@react-native-async-storage/async-storage` - Local storage
- `expo-router` - File-based routing

### Backend
- `express` - Web framework
- `sqlite3` - Database
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - Logging

## 🚨 Troubleshooting

### Common Issues

1. **ConfigError: Cannot determine the project's Expo SDK version**
   - Make sure you're in the correct directory (`education-app`)
   - Run `npm install` to install dependencies

2. **Database connection issues**
   - Ensure the backend server is running
   - Check if `education.db` file exists in the backend directory

3. **CORS errors**
   - The backend is configured to accept requests from Expo development servers
   - Make sure both frontend and backend are running

4. **Authentication failures**
   - Check if JWT_SECRET is properly configured in `.env`
   - Ensure tokens are being sent in the Authorization header

## 📝 Future Enhancements

- [ ] Video lesson support
- [ ] Push notifications
- [ ] Offline sync capabilities
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Social features (comments, ratings)
- [ ] Payment integration
- [ ] Certificate generation

## 🤝 Contributing
Feel free to fork this repository and submit pull requests for improvements!

## 📄 License
MIT License