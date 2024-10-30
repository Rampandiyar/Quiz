import Admin from "../models/Admin.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import AdminToken from "../models/AdminToken.js";
import { CreateError } from "../utilities/error.js";
import { CreateSuccess } from "../utilities/success.js";
import AddQuiz from "../models/AddQuiz.js";
import mongoose from 'mongoose'; // Add this line at the top of your file


export const adminRegister = async (req, res, next) => {
  try {
    const role = await Role.findOne({ role: "Admin" });

    if (!role) {
      return next(CreateError(400, "Admin role not found"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAdmin = new Admin({
      name: req.body.name,
      staffId: req.body.staffId,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: true,
      roles: [role._id],
    });
    await newAdmin.save();
    return next(CreateSuccess(200, "Admin created successfully"));
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ staffId: req.body.staffId }).populate(
      "roles",
      "role"
    );

    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin, roles: admin.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: 200,
      message: " Admin Login successful",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = (req, res, next) => {
  try {
    res.cookie("access_token", "", { httpOnly: true, expires: new Date(0) });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return next(CreateError(400, "Admin not found"));
    }

    await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return next(CreateSuccess(200, "Profile updated successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal error"));
  }
};

export const adminSendEmail = async (req, res, next) => {
  const email = req.body.email;
  const admin = await Admin.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });

  if (!admin) {
    return next(CreateError(404, "Admin not found"));
  }

  const payload = { email: admin.email };
  const expiryTime = 300; // 5 minutes
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiryTime,
  });
  const newToken = new AdminToken({ adminId: admin._id, token });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailDetails = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Link",
    html: `
        <html>
            <head>
                <title>Password Reset Request</title>
            </head>
            <body>
                <h1>Password Reset Link</h1>
                <p>Dear ${admin.name},</p>
                <p>To reset your password, click the following link:</p>
                <a href="${process.env.LIVE_URL}/reset/${token}">
                    <button style="background-color: #4CAF50; color: white; padding: 14px 20px; border:none; cursor: pointer; border-radius:4px">Reset</button>
                </a>
                <p>Validity for 5 minutes</p>
            </body>
        </html>
        `,
  };

  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      return next(CreateError(500, "Failed to send email"));
    }
    await newToken.save();
    return next(CreateSuccess(200, "Email sent successfully"));
  });
};

export const adminResetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(CreateError(400, "Token and new password are required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return next(CreateError(404, "Admin not found"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin.password = hashedPassword;
    await admin.save();

    await AdminToken.findOneAndDelete({ token });

    return next(CreateSuccess(200, "Password updated successfully"));
  } catch (error) {
    return next(CreateError(500, "Failed to reset password"));
  }
};

export const adminGet = async (req, res, next) => {
  try {
    const adminId = req.params.adminId; // Access adminId directly

    if (!adminId) {
      return next(CreateError(400, "Admin ID is required"));
    }

    const admin = await Admin.findById(adminId).populate("name", "name");

    if (!admin) {
      return next(CreateError(404, "Admin not found"));
    }

    return res
      .status(200)
      .json(CreateSuccess(200, "Admin retrieved successfully", admin));
  } catch (error) {
    return next(CreateError(500, "An error occurred while retrieving admin"));
  }
};
export const adminEnableTest = async (req, res) => {
  console.log('Request received:', req.body);
  
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID must be provided" });
    }

    console.log('Quiz ID to search for:', quizId);
    
    // Ensure quizId is an ObjectId
    const quiz = await AddQuiz.findOne({ _id: new mongoose.Types.ObjectId(quizId) });
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.active = true;
    await quiz.save();

    return res.status(200).json({ message: "Quiz enabled successfully" });
  } catch (error) {
    console.error('Error while retrieving quiz:', error);
    return res.status(500).json({ message: "Error while retrieving quiz" });
  }
};
