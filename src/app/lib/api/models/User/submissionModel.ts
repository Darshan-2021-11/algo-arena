import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index:true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem", 
      required: true,
      index:true
    },
    result: {
      type: String,
      default:"Pending",
      // enum: ["Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded","pending"],
      required: true,
    },
    language: {
      type: String, 
      required: true,
      index:true
    },
    code: {
      type: String, 
      required: true,
    },
    executionTime: {
      type: Number,
    },
    memoryUsed: {
      type: Number,
    },
  },
  { timestamps: true } 
);

submissionSchema.index({user:1,language:1});
submissionSchema.index({user:1,problem:1});

const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

export default Submission;
