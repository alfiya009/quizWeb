const express = require('express');
const { body, validationResult } = require('express-validator');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Save quiz result
router.post('/save', auth, [
  body('questions').isArray({ min: 1 }).withMessage('Questions array is required'),
  body('timeUsed').isInt({ min: 0 }).withMessage('Time used must be a positive number'),
  body('completed').isBoolean().withMessage('Completed must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questions, timeUsed, completed = true } = req.body;

    // Process questions and calculate results
    const processedQuestions = questions.map(q => ({
      question: q.question,
      correct_answer: q.correct_answer,
      user_answer: q.user_answer || null,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
      isCorrect: q.user_answer === q.correct_answer
    }));

    const correctAnswers = processedQuestions.filter(q => q.isCorrect).length;
    const totalQuestions = processedQuestions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Create quiz result
    const quizResult = new QuizResult({
      user: req.user._id,
      email: req.user.email,
      questions: processedQuestions,
      score,
      correctAnswers,
      totalQuestions,
      timeUsed,
      completed,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await quizResult.save();

    // Update user statistics
    await req.user.updateStats(score);

    res.status(201).json({
      success: true,
      message: 'Quiz result saved successfully',
      result: {
        id: quizResult._id,
        score,
        correctAnswers,
        totalQuestions,
        timeUsed,
        submittedAt: quizResult.submittedAt
      }
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Server error while saving quiz result' });
  }
});

// Get user's quiz results
router.get('/my-results', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const skip = (page - 1) * limit;
    
    const results = await QuizResult.find({ user: req.user._id })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-questions');

    const total = await QuizResult.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      results,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: skip + results.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Server error while fetching quiz results' });
  }
});

// Get specific quiz result
router.get('/result/:id', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!result) {
      return res.status(404).json({ error: 'Quiz result not found' });
    }

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ error: 'Server error while fetching quiz result' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await QuizResult.getStats(req.user._id);
    const recentResults = await QuizResult.getRecentResults(req.user._id, 5);

    // Calculate additional statistics
    const totalTimeSpent = stats.totalTimeUsed || 0;
    const averageTimePerQuiz = stats.totalAttempts > 0 ? Math.round(totalTimeSpent / stats.totalAttempts) : 0;

    res.json({
      success: true,
      stats: {
        ...stats,
        averageTimePerQuiz,
        totalTimeSpent
      },
      recentResults
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Server error while fetching user statistics' });
  }
});

// Delete quiz result
router.delete('/result/:id', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!result) {
      return res.status(404).json({ error: 'Quiz result not found' });
    }

    res.json({
      success: true,
      message: 'Quiz result deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quiz result:', error);
    res.status(500).json({ error: 'Server error while deleting quiz result' });
  }
});

// Get leaderboard (top scores)
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await QuizResult.aggregate([
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$score' },
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          lastAttempt: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          name: '$user.name',
          email: '$user.email',
          bestScore: 1,
          totalAttempts: 1,
          averageScore: { $round: ['$averageScore', 1] },
          lastAttempt: 1
        }
      },
      {
        $sort: { bestScore: -1, averageScore: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Server error while fetching leaderboard' });
  }
});

module.exports = router; 