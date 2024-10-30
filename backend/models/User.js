import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: [
    {
      name: {
        type: String,
        required: true,
      },
      regno: {
        type: String,
        required: true,
      },
      rollno: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role", // Referencing Role model
        },
      ],
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AddUser", UserSchema);
