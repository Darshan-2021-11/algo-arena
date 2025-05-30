import mongoose, { model, Schema } from "mongoose";

export const contestSchema = new Schema({
	name: {
		type: String,
		required: [true, "Contest name is required."],
		unique: [true, "Contest name must be unique."],
	},
	description: {
		type: String,
		require: true,
	},
	startTime: {
		type: Date,
		required: [true, "Start time of the contest is required."],
	},
	endTime: {
		type: Date,
		required: [true, "End time of the contest is required."],
	},
	// status: {
	// 	type: String,
	// 	enum: ["planned", "ongoing", "completed"],
	// 	default: "planned"
	// },
	problems: {
		type:[String]
	},
	ispublic: {
		type: Boolean,
		default: false
	}	
});
contestSchema.index({ name: 1 });

const Contest = mongoose.models.Contest || model("Contest", contestSchema);
export default Contest;
