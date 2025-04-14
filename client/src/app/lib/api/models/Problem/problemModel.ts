import mongoose, { Schema } from "mongoose";

const testcaseSchema = new Schema({
  input: {
    type: String,
    required: [true,"input is required."],
    minLength: 1,
    maxLength: 1000,
  },
  output: {
    type: String,
    required: [true,"output is required."],
    minLength: 1,
    maxLength: 1000,
  },
},{_id:false})

export const ProblemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      minLength: [1, "Title must be at least 1 character long."],
      maxLength: [240, "Title must be at most 240 characters long."],
    },
    description: {
      type: String,
      required: [true, "Problem description is required."],
      minLength: [1, "Description must be at least 1 character long."],
      maxLength: [1000, "Description must be at most 1000 characters long."],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Problem difficulty is required."],
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags: string[]) {
          return (
            tags.every((tag) => tag.length >= 1 && tag.length <= 15) &&
            tags.length <= 10
          );
        },
        message:
          "Tags must each be between 1 and 15 characters long, and you cannot have more than 10 tags.",
      },
      default: [],
    },
    constraints: {
      type: [String],
      validate: {
        validator: function (constraints: string[]) {
          return (
            constraints.every(
              (constraint) =>
                constraint.length >= 1 && constraint.length <= 25
            ) && constraints.length <= 10
          );
        },
        message:
          "Constraints must each be between 1 and 25 characters long, and you cannot have more than 10 constraints.",
      },
      default: [],
    },
    testcases: 
      {
        type:[testcaseSchema],
        validate:{
          validator: function(constraints:any[]) {
            return constraints.length <= 10
          }
        }
      },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
      min: [1, "Time limit must be at least 1 millisecond."],
      max: [10000, "Time limit must be at most 10,000 milliseconds (10 seconds)."],
      default: 1000,
    },
    spaceLimit: {
      type: Number,
      required: true,
      min: [16, "Space limit must be at least 16 MB."],
      max: [1024, "Space limit must be at most 1024 MB (1 GB)."],
      default: 256,
    },
    submissions: {
      type: Number,
      default: 0,
      min: [0, "Submissions cannot be negative."],
    },
    successfulSubmissions: {
      type: Number,
      default: 0,
      min: [0, "Successful submissions cannot be negative."],
    },
    isdeleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

ProblemSchema.index({ title: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ author: 1 });
ProblemSchema.index({ tags: 1 });

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
export default Problem;