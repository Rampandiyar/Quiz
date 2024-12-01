
import AddUser from "../models/User.js";
import xlsx from 'xlsx';
import mongoose, { Schema } from "mongoose";
import Role from "../models/Role.js";
import jwt from 'jsonwebtoken';


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
    const users = await AddUser.find().select('name details createdAt'); // Select name, details, and createdAt fields

    // Map user data to include the department and year from the first detail entry
    const userData = users.map(user => ({
      _id: user._id,
      name: user.name,
      createdAt: user.createdAt,
      department: user.details[0]?.department, // Assume the first entry
      year: user.details[0]?.year, // Assume the first entry
    }));

    return res.status(200).json({ users: userData });
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


export const userLogin = async (req, res, next) => {
  try {
      const { rollno, password } = req.body; // Get roll number and password from request body
      
      // Find the user by roll number in the details array
      const user = await AddUser.findOne({ "details.rollno": rollno });

      if (!user) {
          return res.status(404).send("User not found");
      }

      // Find the specific detail object that matches the roll number
      const userDetail = user.details.find(detail => detail.rollno === rollno);

      // Check if the password matches
      if (userDetail.password !== password) {
          return res.status(400).send("Invalid password");
      }

      // Generate a token
      const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin, roles: userDetail.roles },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      // Set a cookie with the token
      res.cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json({
              status: 200,
              message: "User Login successful",
              data: {
                  _id: userDetail._id,
                  name: userDetail.name,
                  regno: userDetail.regno,
                  rollno:userDetail.rollno,
                  department:userDetail.department,
                  year:userDetail.year
                  // You can include more details if needed
              } 
          });
  } catch (error) {
      console.error(error); // Log the error for debugging
      next(error);
  }
};
