import express from 'express';
import mongoose from 'mongoose';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import roleRoute from "./routes/roles.js";
import adminRoute from "./routes/admin.js"; // Updated reference
import quizRoute from "./routes/quiz.js"; // Updated reference"
import userRoute from "./routes/aduser.js"; // Updated


import dotenv from 'dotenv';

dotenv.config(); // Move dotenv config up to ensure it's loaded before anything else

const app = express();

// Enable CORS before any route or middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

app.use(express.json());
app.use(cookieparser());

// Define routes after middleware
app.use('/quiz/role', roleRoute);
app.use('/quiz/admin', adminRoute);
app.use('/quiz/quizs', quizRoute); // Updated reference
app.use('/quiz/user',userRoute)
// Updated reference


app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({
        success: [200, 201, 204].includes(statusCode),
        status: statusCode,
        message: message,
        data: err.data || null,
    });
});
const connectMongoose = async (retries = 5, delay = 5000) => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        if (retries === 0) process.exit(1);
        setTimeout(() => connectMongoose(retries - 1, delay), delay);
    }
}

app.listen(5000, () => {
    connectMongoose();
    console.log('Server running on port 5000');
});
