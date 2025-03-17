import mongoose, { Schema } from "mongoose";

const ProblemSchema = new Schema({
    title: {
        type: String,
        required: [true, "Problem title is required."],
      },
      description: {
        type: String,
        required: [true, "Problem description is required."],
      },
      difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: [true, "Problem difficulty is required."],
      },
      tags: {
        type: [String],
        default: [],
        index:1
      },
      constraints: {
        type: String,
      },
      testCases: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true },
        },
      ],
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      timeLimit: {
        type: Number,
        default: 1000, // 1 second
      },
      spaceLimit: {
        type: Number,
        default: 256, // 256 MB
      },
      submissions: {
        type: Number,
        default: 0,
      },
      successfulSubmissions: {
        type: Number,
        default: 0,
      },
    },
);

const Problem = mongoose.models.Problem || mongoose.model("Problem",ProblemSchema);
export default Problem;