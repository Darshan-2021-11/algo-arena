import mongoose, { model, Schema } from "mongoose";
import { contestProblem } from "./problemModel";
import { validate } from "uuid";

export const contestSchema = new Schema({
	name: {
		type: String,
		required:
			[
				true,
				"Contest name is required.",
			],
		unique:
			[
				true,
				"Contest name must be unique.",
			],
	},
	startTime: {
		type: Date,
		required:
			[
				true,
				"Start time of the contest is required.",
			],
	},
	endTime: {
		type: Date,
		required:
			[
				true,
				"End time of the contest is required.",
			],
	},
	problems: [{
		type: mongoose.Types.ObjectId,
		ref: "contestproblems"
	}, { _id: false }
	],
	type: {
		type: String,
		enum: ["ICPC",],
		required: [
			true,
			"Contest type is required.",
		],
	}
},
	{
		_id: false,
	});

contestSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		ret.name = ret._id;
		delete ret._id;
	}
});

contestSchema.index({ name: 1 });

const Contest = mongoose.models.Contest || model("Contest", contestSchema);
export default Contest;
