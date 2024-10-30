import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema({
  name: { type: String, required: true },
  questions: [
    {
      qno: { type: String, required: true },
      question: { type: String, required: true },
      option1: { type: String, required: true },
      option2: { type: String, required: true },
      option3: { type: String, required: true },
      option4: { type: String, required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
  active: { type: Boolean, default: false },
  duration: { type: Number, default: 0 }, // Duration in seconds
}, { timestamps: true });

export default mongoose.model('AddQuiz', QuizSchema);
