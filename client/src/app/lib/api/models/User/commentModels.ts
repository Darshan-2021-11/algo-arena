import mongoose, { model, Schema } from "mongoose";

const commentSchema = new Schema({
    user:{
        require:true,
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    problem:{
        require:true,
        type: mongoose.Types.ObjectId,
        ref:"Problem"
    },
    parent:{
        type: mongoose.Types.ObjectId,
        ref:"Comment"
    },
    message:{
        require:true,
        type:String,
        minLength: [1, "message must be at least 10 characters long."],
        maxLength: [50000, "message can be at most 50,000 characters long."],
    }
});

const Comment = mongoose.models.Comment || model("Comment",commentSchema);

export default Comment;