import mongoose, { Schema } from 'mongoose';

const AdminTokenSchema = new Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // This will automatically delete the token after 1 hour
    }
});

export default mongoose.model('AdminToken', AdminTokenSchema);
