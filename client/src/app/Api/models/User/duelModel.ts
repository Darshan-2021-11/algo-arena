import mongoose, { Schema } from "mongoose";

const DuelSchema = new Schema({
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user1 is required"]
    },
    user2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user2 is required"]
    },
    problem:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem", 
        required: [true,"problem is required"],
    },
    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    duration:{
        type:Number,
        default:60
    },
    status: {
        type: String,
        enum: [ 1,2,3,4],
            // "in-progress", "completed", "cancelled","draw"],
        default: 1,
    },
    winnerCode:{
        type:String,
        required:false
    }
})

const Duel = mongoose.models.Duel || mongoose.model("Duel",DuelSchema);
export default Duel;