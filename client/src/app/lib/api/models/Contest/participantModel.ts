import mongoose, { Schema, model } from "mongoose";

const participantSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	contest: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contest",
		required: true
	},
	solved:{
		type:[String],
		default:[]
	}
});

participantSchema.index({user:1, contest:1},{unique:true});

const Participant = mongoose.models.Participant || model("Participant", participantSchema);

export default Participant;