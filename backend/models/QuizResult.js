import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddQuiz', required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  selectedAnswers: [{ type: String }], // Array of selected answers
  marks: { type: Number, required: true }, // Marks for the quiz
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('QuizResult', QuizResultSchema);
