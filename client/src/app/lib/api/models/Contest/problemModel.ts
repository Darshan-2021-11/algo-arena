import mongoose, { model, Schema } from "mongoose";

// export const contestProblem = new Schema(ProblemSchema.obj, {
// 	timestamps: {
// 		createdAt: true,
// 		updatedAt: false,
// 	}
// });
// contestProblem.add({
// 	alias: {
// 		type: String,
// 		required: true,
// 	},
// 	contest:{
// 		ref:"Contest",
// 		type:mongoose.Types.ObjectId,
// 		index: true,
// 		default:null
// 	},
// 	score: {
// 		type: Number,
// 		required:
// 			[
// 			true,
// 			"Problem score must be specified.",
// 		],
// 	},
// });

const contestProblem = new Schema({
	problem:{
		type: mongoose.Types.ObjectId, 
		ref: "Problem", 
		required: true
	},
	contest:{
		type: mongoose.Types.ObjectId, 
		ref: "Contest", 
		required: true
	},
	ispublic:{
		type: Boolean, 
		default: true
	},
	score:{
		type:Number,
		default:10
	}
})

const ContestProblem = mongoose.models.ContestProblem || model("ContestProblem", contestProblem);
export default ContestProblem;
