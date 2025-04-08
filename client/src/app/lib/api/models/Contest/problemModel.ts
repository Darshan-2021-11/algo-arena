import mongoose, { model, Schema } from "mongoose";
import {ProblemSchema} from "../Problem/problemModel";

export const contestProblem = new Schema(ProblemSchema.obj)
contestProblem.add({
	alias: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required:
			[
			true,
			"Problem score must be specified.",
		],
	},
});

const ContestProblem = mongoose.models.contestProblem || model("contestProblem", contestProblem);
export default ContestProblem;
