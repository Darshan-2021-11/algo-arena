import mongoose, { Schema, model } from "mongoose";

const contestSubmissionSchema = new Schema({
	tokens: {
		type: [String],
		required: true
	},
	status: {
		type: String,
		default: "waiting",
		required: true
	},
	participant:{
        type:String,
        require:true,
        ref:"Participant",
        index:true
    }
});


const ContestSubmission = mongoose.models.ContestSubmission || model("ContestSubmission", contestSubmissionSchema);

export default ContestSubmission;