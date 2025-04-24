import mongoose, { model, Schema } from "mongoose";

const dpSchema = new Schema({
    type: {
        type: String,
        require: true
    },
    size: {
        type: Number,
        require: true
    },
    data: {
        type: Buffer,
        require: true
    },
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        unique: true,
        required: [true, "user is required."]
    }
});

const Dp = mongoose.models.Dp || model("Dp", dpSchema);
export default Dp;