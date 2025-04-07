import mongoose, { model, Schema } from "mongoose";
import {contestProblem} from "./problemModel";

const contestSchema = new Schema({
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
	problems: [contestProblem],
	type: {
		type: String,
		enum: [ "ICPC", ],
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

const Contest = mongoose.models.Contest || model("Contest",contestSchema);
export default Contest;
