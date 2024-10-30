import AddUser from "../models/User.js";
import { CreateError } from "../utilities/error.js";
import { CreateSuccess } from "../utilities/success.js";
import jwt from 'jsonwebtoken';

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


export const getUser = async (req, res, next) => {
    try {
        // Retrieve the detailId from the request params
        const detailId = req.params.userId; // This should be the detail ID you are passing

        // Check if detailId is provided
        if (!detailId) {
            return next(CreateError(400, 'Detail ID is required'));
        }

        // Find the user document
        const user = await AddUser.findOne({ 'details._id': detailId }); // Use details._id to find the user

        // If user not found, return 404 error
        if (!user) {
            return next(CreateError(404, 'User not found'));
        }

        // Extract user details that match the detailId
        const userDetails = user.details.find(detail => detail._id.toString() === detailId); // Match the detail by ID

        // If user details not found, return an error
        if (!userDetails) {
            return next(CreateError(404, 'User details not found'));
        }

        // Send the user details back in response
        return res.status(200).json(CreateSuccess(200, 'User retrieved successfully', userDetails));
    } catch (error) {
        console.error('Error retrieving user:', error); // Log the error for debugging
        return next(CreateError(500, 'An error occurred while retrieving user'));
    }
};
