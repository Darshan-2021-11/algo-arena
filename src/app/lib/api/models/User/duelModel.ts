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
        default:null
    },
    duration:{
        type:Number,
        min:[10,"minimum duration is 10 min."],
        max:[300,"maximum duration is 300 minutes."],
        default:30
    },
    status: {
        type: String,
        enum: [ 1,2],
            // "in-progress", "completed"],
        default: 1,
    },
    winnerCode:{
        type:String,
        // minLength: [10, "Code must be at least 10 characters long."],
        maxLength: [50000, "Code can be at most 50,000 characters long."],
        default:""
    }
})

const Duel = mongoose.models.Duel || mongoose.model("Duel",DuelSchema);
export default Duel;