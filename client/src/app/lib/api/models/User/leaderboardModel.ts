import mongoose, { Schema } from "mongoose";

const leaderboardSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index:true
    },
    score: {
        type: Number,
        default: 0,
    }
});

const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;