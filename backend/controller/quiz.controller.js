import Marks from "../models/Marks.js";
import AddQuiz from "../models/AddQuiz.js";

export const getAllMarks = async (req, res, next) => {
  try {
    // Fetch marks from the database, selecting only the details field
    const marks = await Marks.find().select('details'); // Select only the details array

    // Extract and flatten the details arrays from the marks
    const marksDetails = marks.map(mark => mark.details).flat(); // Flatten the details arrays

    // Ensure that marksDetails contains all the required fields
    return res.status(200).json({ marks: marksDetails });
  } catch (error) {
    console.error("Error fetching marks:", error);
    return res.status(500).json({ message: "Error fetching marks", error });
  }
};


// Add a question to a quiz
export const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { qno, question, option1, option2, option3, option4, correctAnswer } = req.body;

    if (!qno || !question || !option1 || !option2 || !option3 || !option4 || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const quiz = await AddQuiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions.push({ qno, question, option1, option2, option3, option4, correctAnswer });
    await quiz.save();

    return res.status(201).json({ message: "Question added successfully", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Error adding question", error });
  }
};

// Edit a question in a quiz
export const editQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { qno, question, option1, option2, option3, option4, correctAnswer } = req.body;

    const quiz = await AddQuiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update question details
    quiz.questions[questionIndex] = {
      ...quiz.questions[questionIndex].toObject(),
      qno,
      question,
      option1,
      option2,
      option3,
      option4,
      correctAnswer
    };

    await quiz.save();

    return res.status(200).json({ message: "Question updated successfully", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Error editing question", error });
  }
};

// Delete a question from a quiz
export const deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const quiz = await AddQuiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" });
    }

    quiz.questions.splice(questionIndex, 1);
    await quiz.save();

    return res.status(200).json({ message: "Question deleted successfully", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting question", error });
  }
};
