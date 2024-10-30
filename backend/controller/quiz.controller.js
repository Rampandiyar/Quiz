import Marks from "../models/Marks.js";


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
