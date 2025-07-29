const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Fetch questions from OpenTDB API
router.get('/questions', auth, async (req, res) => {
  try {
    const { amount = 15, category, difficulty } = req.query;
    
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    
    if (category) {
      apiUrl += `&category=${category}`;
    }
    
    if (difficulty) {
      apiUrl += `&difficulty=${difficulty}`;
    }

    const response = await axios.get(apiUrl);
    
    if (response.data.response_code !== 0) {
      throw new Error('Failed to fetch questions from API');
    }

    const questions = response.data.results.map((question, index) => ({
      id: index,
      question: question.question,
      correct_answer: question.correct_answer,
      options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
      category: question.category,
      difficulty: question.difficulty
    }));

    res.json({
      success: true,
      questions,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    
    // Fallback questions in case API fails
    const fallbackQuestions = [
      {
        id: 0,
        question: "What is the capital of France?",
        correct_answer: "Paris",
        options: ["London", "Berlin", "Paris", "Madrid"],
        category: "Geography",
        difficulty: "easy"
      },
      {
        id: 1,
        question: "Which planet is known as the Red Planet?",
        correct_answer: "Mars",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        category: "Science",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "What is the largest ocean on Earth?",
        correct_answer: "Pacific Ocean",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        category: "Geography",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Who wrote 'Romeo and Juliet'?",
        correct_answer: "William Shakespeare",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        category: "Literature",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "What is the chemical symbol for gold?",
        correct_answer: "Au",
        options: ["Ag", "Au", "Fe", "Cu"],
        category: "Science",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "Which year did World War II end?",
        correct_answer: "1945",
        options: ["1943", "1944", "1945", "1946"],
        category: "History",
        difficulty: "medium"
      },
      {
        id: 6,
        question: "What is the largest mammal in the world?",
        correct_answer: "Blue Whale",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        category: "Science",
        difficulty: "easy"
      },
      {
        id: 7,
        question: "Which programming language was created by Brendan Eich?",
        correct_answer: "JavaScript",
        options: ["Python", "Java", "JavaScript", "C++"],
        category: "Technology",
        difficulty: "medium"
      },
      {
        id: 8,
        question: "What is the currency of Japan?",
        correct_answer: "Yen",
        options: ["Yuan", "Yen", "Won", "Ringgit"],
        category: "Geography",
        difficulty: "easy"
      },
      {
        id: 9,
        question: "Who painted the Mona Lisa?",
        correct_answer: "Leonardo da Vinci",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        category: "Art",
        difficulty: "medium"
      },
      {
        id: 10,
        question: "What is the speed of light?",
        correct_answer: "299,792,458 meters per second",
        options: ["299,792,458 meters per second", "199,792,458 meters per second", "399,792,458 meters per second", "499,792,458 meters per second"],
        category: "Science",
        difficulty: "hard"
      },
      {
        id: 11,
        question: "Which country is home to the kangaroo?",
        correct_answer: "Australia",
        options: ["New Zealand", "Australia", "South Africa", "Brazil"],
        category: "Geography",
        difficulty: "easy"
      },
      {
        id: 12,
        question: "What is the largest desert in the world?",
        correct_answer: "Antarctic Desert",
        options: ["Sahara Desert", "Arabian Desert", "Antarctic Desert", "Gobi Desert"],
        category: "Geography",
        difficulty: "medium"
      },
      {
        id: 13,
        question: "Who is the author of 'The Great Gatsby'?",
        correct_answer: "F. Scott Fitzgerald",
        options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"],
        category: "Literature",
        difficulty: "medium"
      },
      {
        id: 14,
        question: "What is the atomic number of carbon?",
        correct_answer: "6",
        options: ["4", "5", "6", "7"],
        category: "Science",
        difficulty: "medium"
      }
    ];

    res.json({
      success: true,
      questions: fallbackQuestions,
      totalQuestions: fallbackQuestions.length,
      message: "Using fallback questions due to API unavailability"
    });
  }
});

// Get quiz categories
router.get('/categories', auth, async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    res.json({
      success: true,
      categories: response.data.trivia_categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.json({
      success: true,
      categories: [
        { id: 9, name: "General Knowledge" },
        { id: 10, name: "Entertainment: Books" },
        { id: 11, name: "Entertainment: Film" },
        { id: 12, name: "Entertainment: Music" },
        { id: 14, name: "Entertainment: Television" },
        { id: 15, name: "Entertainment: Video Games" },
        { id: 17, name: "Science & Nature" },
        { id: 18, name: "Science: Computers" },
        { id: 19, name: "Science: Mathematics" },
        { id: 20, name: "Mythology" },
        { id: 21, name: "Sports" },
        { id: 22, name: "Geography" },
        { id: 23, name: "History" },
        { id: 24, name: "Politics" },
        { id: 25, name: "Art" },
        { id: 27, name: "Animals" },
        { id: 28, name: "Vehicles" },
        { id: 29, name: "Entertainment: Comics" },
        { id: 30, name: "Science: Gadgets" },
        { id: 32, name: "Entertainment: Cartoon & Animations" }
      ]
    });
  }
});

// Get quiz statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const QuizResult = require('../models/QuizResult');
    const stats = await QuizResult.getStats(req.user._id);
    const recentResults = await QuizResult.getRecentResults(req.user._id, 5);
    
    res.json({
      success: true,
      stats,
      recentResults
    });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({ error: 'Server error while fetching quiz statistics' });
  }
});

module.exports = router; 