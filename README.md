# Full-Stack Quiz Application

A complete full-stack quiz application built with React frontend and Node.js/Express backend with MongoDB database. Features user authentication, quiz management, result tracking, and detailed analytics.

## 🚀 Features

### Frontend (React)
- **User Authentication**: Login/Register with JWT tokens
- **Interactive Quiz Interface**: 15 questions with 30-minute timer
- **Real-time Navigation**: Question overview with status indicators
- **Responsive Design**: Works on all devices and browsers
- **Result Analytics**: Detailed score breakdown and performance metrics
- **User Dashboard**: Personal statistics and quiz history

### Backend (Node.js/Express)
- **RESTful API**: Complete CRUD operations
- **User Management**: Registration, login, profile updates
- **Quiz Engine**: Question fetching from OpenTDB API with fallbacks
- **Result Tracking**: Save and retrieve quiz attempts
- **Statistics**: User performance analytics and leaderboards
- **Security**: JWT authentication, password hashing, rate limiting

### Database (MongoDB)
- **User Collection**: User profiles and authentication data
- **Quiz Results**: Complete quiz attempts with detailed analytics
- **Performance Tracking**: User statistics and progress monitoring

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with responsive design
- **Local Storage** - Client-side session management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Database
- **MongoDB** - Document-based database
- **Mongoose** - Schema-based modeling

## 📁 Project Structure

```
quiz-application/
├── public/                 # Static files
├── src/                   # React frontend
│   ├── components/        # React components
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── StartPage.js
│   │   ├── QuizPage.js
│   │   └── ReportPage.js
│   ├── services/          # API services
│   │   └── api.js
│   ├── App.js            # Main app component
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
├── server/               # Node.js backend
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   └── QuizResult.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── quiz.js
│   │   └── results.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies
│   └── config.env        # Environment variables
├── package.json          # Frontend dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd quiz-application
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**:
   ```bash
   # Edit server/config.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz_app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Start the backend server**:
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend** (in a new terminal):
   ```bash
   npm start
   ```

8. **Open your browser** and navigate to `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Quiz Management
- `GET /api/quiz/questions` - Fetch quiz questions
- `GET /api/quiz/categories` - Get question categories
- `GET /api/quiz/stats` - Get user quiz statistics

### Results Management
- `POST /api/results/save` - Save quiz result
- `GET /api/results/my-results` - Get user's quiz results
- `GET /api/results/result/:id` - Get specific quiz result
- `GET /api/results/stats` - Get user statistics
- `DELETE /api/results/result/:id` - Delete quiz result
- `GET /api/results/leaderboard` - Get leaderboard

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: express-validator for data validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers middleware
- **Environment Variables**: Secure configuration management

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  quizAttempts: Number,
  averageScore: Number,
  bestScore: Number,
  timestamps: true
}
```

### QuizResult Model
```javascript
{
  user: ObjectId (ref: User),
  email: String,
  questions: [{
    question: String,
    correct_answer: String,
    user_answer: String,
    options: [String],
    category: String,
    difficulty: String,
    isCorrect: Boolean
  }],
  score: Number,
  correctAnswers: Number,
  totalQuestions: Number,
  timeUsed: Number,
  completed: Boolean,
  submittedAt: Date,
  timestamps: true
}
```

## 🎯 Key Features

### User Experience
- **Seamless Authentication**: Login/register with persistent sessions
- **Real-time Quiz Interface**: Interactive question navigation
- **Progress Tracking**: Visual indicators for question status
- **Auto-save**: Results automatically saved to database
- **Responsive Design**: Works perfectly on mobile and desktop

### Admin Features
- **User Management**: View and manage user accounts
- **Quiz Analytics**: Comprehensive statistics and reporting
- **Leaderboards**: Track top performers
- **Result Management**: View and manage quiz results

### Performance
- **Optimized Queries**: Efficient database operations
- **Caching**: Client-side caching for better performance
- **Error Handling**: Comprehensive error management
- **Fallback Systems**: Graceful degradation when APIs fail

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend Deployment
```bash
cd server
npm install --production
# Deploy to your server (Heroku, AWS, etc.)
```

### Environment Variables for Production
```bash
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## 🔧 Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm start
```

### Database Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGODB_URI in server/config.env
```

## 📈 Future Enhancements

- **Real-time Features**: WebSocket integration for live updates
- **Advanced Analytics**: Detailed performance insights
- **Quiz Categories**: Subject-specific quizzes
- **Social Features**: Share results, friend challenges
- **Mobile App**: React Native version
- **Admin Dashboard**: Comprehensive admin interface
- **Email Notifications**: Result sharing via email
- **Offline Support**: Service worker for offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Node.js, Express, and MongoDB** 