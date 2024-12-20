import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddQuiz', // Adjust this according to your model name
    required: true,
  },
  details: [{
    name: {
      type: String,
      required: true,
    },
    regno: {
      type: String,
      required: true,
    },
    rollno: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    }
  }]
});

const Marks = mongoose.model('Marks', MarksSchema);
export default Marks;
