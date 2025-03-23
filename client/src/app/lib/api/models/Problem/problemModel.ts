import mongoose, { Schema } from "mongoose";

const ProblemSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    minLength: [3, "Title must be at least 3 characters long."],
    maxLength: [240, "Title must be at most 240 characters long."],
  },
  description: {
    type: String,
    required: [true, "Problem description is required."],
    minLength: [3, "Description must be at least 3 characters long."],
    maxLength: [1000, "Description must be at most 1000 characters long."],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: [true, "Problem difficulty is required."],
  },
  tags: {
    type: [String],
    validate: [
      {
        validator: function (tags:string[]) {
          return tags.every((tag) => tag.length >= 3 && tag.length <= 15); // Each tag's length
        },
        message: "Each tag must be between 3 and 15 characters long.",
      },
      {
        validator: function (tags:string[]) {
          return tags.length <= 10; // Limit number of tags
        },
        message: "You cannot have more than 10 tags.",
      },
    ],
    default: [],
    index: true,
  },
  constraints: {
    type: [String],
    validate: [
      {
        validator: function (constraints:string[]) {
          return constraints.every((constraint) => constraint.length >= 3 && constraint.length <= 25); // Each constraint's length
        },
        message: "Each constraint must be between 3 and 25 characters long.",
      },
      {
        validator: function (constraints:string[]) {
          return constraints.length <= 10; // Limit number of constraints
        },
        message: "You cannot have more than 10 constraints.",
      },
    ],
    default: [],
  },
  testcases: [
    {
      input: { 
        type: String, 
        required: true,
        minLength: [1, "Input must be at least 1 character long."], 
        maxLength: [1000, "Input must be at most 1000 characters long."] 
      },
      output: { 
        type: String, 
        required: true,
        minLength: [1, "Output must be at least 1 character long."], 
        maxLength: [1000, "Output must be at most 1000 characters long."] 
      },
      validate:{
        validator: function (constraints:string[]) {
          return constraints.every((constraint) => constraint.length >= 3 && constraint.length <= 25); // Each constraint's length
        },
        message: "Each constraint must be between 3 and 25 characters long.",
      }
    },
  ],
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
    default: 1000, // 1 second
  },
  spaceLimit: {
    type: Number,
    required: true,
    min: [16, "Space limit must be at least 16 MB."],
    max: [1024, "Space limit must be at most 1024 MB (1 GB)."],
    default: 256, // 256 MB
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
}, 
{ timestamps: true } 
);

const Problem = mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
export default Problem;
