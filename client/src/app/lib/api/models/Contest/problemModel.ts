import mongoose, { model, Schema } from "mongoose";
import Problem from "../Problem/problemModel.ts";

const contestProblem = Problem.clone();
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
