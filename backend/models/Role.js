import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false, // Removes __v field from the documents
  }
);

export default mongoose.model('Role', RoleSchema);
