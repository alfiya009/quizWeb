const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    user_answer: {
      type: String,
      default: null
    },
    options: [{
      type: String
    }],
    category: String,
    difficulty: String,
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  timeUsed: {
    type: Number, // in seconds
    required: true
  },
  timeLimit: {
    type: Number, // in seconds
    default: 1800 // 30 minutes
  },
  completed: {
    type: Boolean,
    default: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Calculate score before saving
quizResultSchema.pre('save', function(next) {
  if (this.isModified('questions')) {
    this.correctAnswers = this.questions.filter(q => q.isCorrect).length;
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
  next();
});

// Get quiz statistics
quizResultSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        totalTimeUsed: { $sum: '$timeUsed' },
        averageTimeUsed: { $avg: '$timeUsed' }
      }
    }
  ]);
  
  return stats[0] || {
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeUsed: 0,
    averageTimeUsed: 0
  };
};

// Get recent results
quizResultSchema.statics.getRecentResults = async function(userId, limit = 10) {
  return await this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('score correctAnswers totalQuestions timeUsed submittedAt');
};

module.exports = mongoose.model('QuizResult', quizResultSchema); 