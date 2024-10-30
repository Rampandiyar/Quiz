import AddUser from "../models/User.js";
import xlsx from 'xlsx';
import mongoose, { Schema } from "mongoose";
import Role from "../models/Role.js";



// Controller for handling user upload from an Excel file
export const addUser = async (req, res, next) => {
  try {
    const excelFile = req.file; // Retrieve the uploaded file
    const role = await Role.findOne({ role: "User" });
    if (!role) {
      return next(CreateError(400, 'Admin role not found'));
    }

    if (!excelFile) {
      return res.status(400).json({ message: "Excel file is missing" });
    }

    // Extract the file name without extension and use it as the user name
    const fileName = excelFile.originalname.split('.').slice(0, -1).join('.');
    
    // Parse the Excel file
    const workbook = xlsx.readFile(excelFile.path);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const userData = xlsx.utils.sheet_to_json(firstSheet);

    // Use the Excel file name as the username or fallback to generated one
    const userName = fileName || `User-${Date.now()}`;

    // Check if a user with the same name already exists
    const existingUser = await AddUser.findOne({ name: userName });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this name already exists." });
    }

    // Map the userData to the details array, including an ObjectId for each detail
    const details = userData.map((user) => ({
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
      name: user.name,
      regno: user.regno,
      rollno: user.rollno,
      department: user.department,
      year: user.year,
      email: user.email,
      number: user.number,
      password: user.password,
      roles: [role._id],
    }));

    // Save the user data to MongoDB
    const user = new AddUser({
      name: userName,
      details,
    });
    
    await user.save();

    return res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error while uploading user", error });
  }
};


// Get quizzes
export const getUsers = async (req, res, next) => {
  try {
    const users = await AddUser.find().select('name createdAt'); // Select only needed fields
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};
// Update quiz name
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Quiz name is required" });
    }

    const user = await AddUser.findByIdAndUpdate(id, { name }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a quiz
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await AddUser.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

export const getUsersdetails = async (req, res, next) => {
  try {
    // Fetch users from the database
    const users = await AddUser.find().select('details'); // Select only the details array

    // Extract the details array from each user
    const userDetails = users.map(user => user.details).flat(); // Flatten the details arrays

    // Ensure that userDetails contains all the required fields
    return res.status(200).json({ users: userDetails });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

