import express from "express";
import { addUser, deleteUser, getUsers, getUsersdetails, updateUser } from "../controller/adUser.controller.js";
import multer from "multer";
import { getUser, userLogin } from "../controller/user.controller.js";

import { setQuizDuration } from "../controller/adQuiz.controller.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Directory where uploaded Excel files will be stored

// Route for adding users via Excel upload
router.post('/adduser', upload.single('excel'), addUser);

// Route for getting all users
router.get('/users', getUsers);

router.get('/usersdetails', getUsersdetails);

// Route for updating a user by ID
router.put('/users/:id', updateUser);

// Route for deleting a user by ID
router.delete('/users/:id', deleteUser);

// Route for user login
router.post('/ur-login', userLogin);

// Route for getting details of a user by ID
router.get('/ur-get/:userId', getUser);


router.post('/quizes/:quizId/set-duration', setQuizDuration);

export default router;
