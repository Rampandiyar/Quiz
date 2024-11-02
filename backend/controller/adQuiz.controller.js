import AddQuiz from "../models/AddQuiz.js";
import xlsx from 'xlsx';
import Marks from "../models/Marks.js";

// Add a quiz
export const addQuiz = async (req, res, next) => {
  try {
    const excelFile = req.file;

    if (!excelFile) {
      return res.status(400).json({ message: "Excel file is missing" });
    }

    const fileName = excelFile.originalname.split('.').slice(0, -1).join('.');
    const workbook = xlsx.readFile(excelFile.path);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const quizData = xlsx.utils.sheet_to_json(firstSheet);
    const quizName = fileName || `Quiz-${Date.now()}`;

    const existingQuiz = await AddQuiz.findOne({ name: quizName });
    if (existingQuiz) {
      return res.status(400).json({ message: "A quiz with this name already exists." });
    }

    const quiz = new AddQuiz({ name: quizName, questions: quizData });
    await quiz.save();

    return res.status(201).json({ message: "Quiz added successfully", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Error while uploading quiz", error });
  }
};

// Get quizzes
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await AddQuiz.find().select('name createdAt active');
    return res.status(200).json({ quizzes });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

// Update quiz name
export const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Quiz name is required" });
    }

    const quiz = await AddQuiz.findByIdAndUpdate(id, { name }, { new: true });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Error updating quiz", error });
  }
};

// Delete a quiz
// Delete a quiz
// Delete a quiz
export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the quiz
    const quiz = await AddQuiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Delete associated marks
    await Marks.deleteMany({ quizId: id }); // Adjust this if the field name differs in the Marks model

    // Here you may need to reset the timer in whatever way you have implemented it
    // For example, if timers are stored in a separate model or in-memory, handle that accordingly

    return res.status(200).json({ message: "Quiz and associated marks deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting quiz", error });
  }
};



// Get quiz questions without the correct answers
export const getQuizQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the quiz by its ID and include only necessary fields
    const quiz = await AddQuiz.findById(id).select('questions _id duration');
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Map each question to include the correct answer and other details
    const questionsWithAnswers = quiz.questions.map(question => question.toObject());

    // Send quiz data, including each question's correct answer
    return res.status(200).json({ _id: quiz._id, duration: quiz.duration, questions: questionsWithAnswers });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching quiz questions", error });
  }
};

// Set quiz duration
export const setQuizDuration = async (req, res) => {
  try {
    const { quizId } = req.params; // Get quizId from URL parameters
    const { duration } = req.body; // Get duration from request body

    console.log(`Setting duration for quiz ID: ${quizId}`); // Log the quizId

    // Validate the duration
    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ message: "Duration must be a positive number" });
    }

    // Find and update the quiz duration by ID
    const quiz = await AddQuiz.findByIdAndUpdate(
      quizId, // Searching by ObjectId
      { duration },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ message: `Quiz with ID ${quizId} not found.` });
    }

    // Respond with the updated quiz
    return res.status(200).json({ message: "Quiz duration set successfully", quiz });
  } catch (error) {
    console.error('Error setting quiz duration:', error); // Log the error
    return res.status(500).json({ message: "Error setting quiz duration", error });
  }
};


export const submitQuizResults = async (req, res) => {
  console.log('Received request body:', req.body);
  try {
    const { quizId, name, regno, rollno, department, year, mark } = req.body;

    // Validate incoming data
    if (!quizId || !name || !regno || !rollno || !department || !year || mark == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // New user's quiz details
    const userResult = {
      name,
      regno,
      rollno,
      department,
      year,
      marks: mark,
    };

    // Check if a quiz result document with this quizId already exists
    let quizResult = await Marks.findOne({ quizId });

    if (quizResult) {
      // If quiz result exists, add the new user's result to the details array
      quizResult.details.push(userResult);
    } else {
      // If no document exists, create a new one
      quizResult = new Marks({
        quizId,
        details: [userResult],
      });
    }

    // Save the updated or new document
    await quizResult.save();

    return res.status(201).json({ message: "Quiz results submitted successfully", marks: mark });
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    return res.status(500).json({ message: 'Error submitting quiz results', error });
  }
};
