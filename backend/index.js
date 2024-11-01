import express from 'express';
import mongoose from 'mongoose';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import tmp from 'tmp';
import roleRoute from "./routes/roles.js";
import adminRoute from "./routes/admin.js"; // Updated reference
import quizRoute from "./routes/quiz.js"; // Updated reference
import userRoute from "./routes/aduser.js"; // Updated

import dotenv from 'dotenv';

dotenv.config(); // Move dotenv config up to ensure it's loaded before anything else

const app = express();

// Enable CORS before any route or middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

app.use(express.json());
app.use(cookieparser());

// Create a temporary directory for file uploads
const tmpDir = tmp.dirSync({ unsafeCleanup: true }).name;

// Configure multer to use the temporary directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tmpDir); // Use the temporary directory for uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Store the file with its original name
    }
});

const upload = multer({ storage: storage });

// Define routes after middleware
app.use('/quiz/role', roleRoute);
app.use('/quiz/admin', adminRoute);
app.use('/quiz/quizs', quizRoute); // Updated reference
app.use('/quiz/user', userRoute); // Updated reference

// Example route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully!', file: req.file });
});

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
        await mongoose.connect(process.env.MONGO_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        if (retries === 0) process.exit(1);
        setTimeout(() => connectMongoose(retries - 1, delay), delay);
    }
};

app.listen(5000, () => {
    connectMongoose();
    console.log('Server running on port 5000');
});
