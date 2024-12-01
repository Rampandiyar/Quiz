import express from "express";
import {
  addQuiz,
  deleteQuiz,
  getQuizQuestions,
  getQuizzes,
  setQuizDuration,
  submitQuizResults,
  updateQuiz
} from "../controller/adQuiz.controller.js";
import multer from "multer";
import { addQuestion, deleteQuestion, editQuestion, getAllMarks } from "../controller/quiz.controller.js";


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route to add a quiz
router.post('/addquiz', upload.single('excel'), addQuiz);

// Route to get all quizzes
router.get('/quizes', getQuizzes);

// Route for updating a quiz
router.put('/quizes/:id', updateQuiz);

// Route for deleting a quiz
router.delete('/quizes/:id', deleteQuiz);

// Route to get quiz questions
router.get('/quizes/:id/questions', getQuizQuestions);

router.post('/quizes/:quizId/submit', submitQuizResults);
// Route to set quiz duration
router.post('/quizes/:quizId/set-duration', setQuizDuration);

router.get('/quizes/all', getAllMarks);
router.delete('/quizes/:id', deleteQuiz);

// Route to add a question to a quiz
router.post('/quizzes/:quizId/questions', addQuestion);

// Route to edit a question in a quiz
router.put('/quizzes/:quizId/questions/:questionId', editQuestion);

// Route to delete a question from a quiz
router.delete('/quizzes/:quizId/questions/:questionId', deleteQuestion);

export default router;
