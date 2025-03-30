import mongoose, { model, Schema } from "mongoose";

const problemSchema = new Schema({
    user:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        unique:true
    },
    submission:{
        type:Number,
        default:0,
        min: [0, "Submissions cannot be negative."]
    },
    hardQuestion:{
        type:Number,
        default:0
    },
    mediumQuestion:{
        type:Number,
        default:0
    },
    easyQuestion:{
        type:Number,
        default:0
    },
    
})

const UserProblem = mongoose.models.UserProblem || model("UserProblem",problemSchema);
export default UserProblem;