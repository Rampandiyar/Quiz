import express from 'express';
import multer from 'multer';
import {addUser, deleteUser, getUsers, updateUser, userLogin} from '../controller/adUser.controller.js';
import { addUserDetail, deleteUserDetail, editUserDetail, getUsersdetails} from '../controller/user.controller.js';
import { setQuizDuration } from '../controller/adQuiz.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Directory where uploaded Excel files will be stored

// Route for adding users via Excel upload
router.post('/adduser', upload.single('excel'), addUser);

// Route for getting all users
router.get('/users', getUsers);

// Route for getting all user details
router.get('/usersdetails', getUsersdetails);

// Route for updating a user by ID
router.put('/users/:id', updateUser);

// Route for deleting a user by ID
router.delete('/users/:id', deleteUser);

// Route for user login
router.post('/ur-login', userLogin);

// Route for setting quiz duration
router.post('/quizes/:quizId/set-duration', setQuizDuration);

// Routes for user management
router.post("/add", addUserDetail); // Add new user
router.put("/edit", editUserDetail); // Edit user details
router.delete("/delete", deleteUserDetail); // Delete user from details array



export default router;
