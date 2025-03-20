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
    submissionTime: {
      type: Date,
      default: Date.now,
    },
    result: {
      type: String,
      enum: [1,2,3,4,5],
        // "Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded"
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

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
