import mongoose,{Schema} from "mongoose";

const AdminSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    staffId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:true
    },
    roles:[{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }]
},
{
    timestamps: true
});

export default mongoose.model('Admin', AdminSchema);
