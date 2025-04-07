import mongoose, { Schema, model } from "mongoose";


const SubmissionSchema = new Schema({
	time: {
		type: Date,
		default: Date.now,
		required: true
	},
	tokens: {
		type: [String],
		required: true
	},
	status: {
		type: String,
		enum: ["AC", "WA", "TLE", "MLE", "waiting"],
		default: "waiting",
		required: true
	}
}, { _id: false });

const ProblemSubmissionStatsSchema = new Schema({
	alias: {
		type: String,
		required: true
	},
	submissions: {
		type: [SubmissionSchema],
		default: []
	}
}, { _id: false });

const ParticipantSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	contestId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contest",
		required: true
	},
	problems: {
		type: [ ProblemSubmissionStatsSchema ],
		required: true
	},
}, { timestamps: true });

ParticipantSchema.index({ userId: 1, contestId: 1 }, { unique: true });

const Participant = mongoose.models.Participant || model("Participant", ParticipantSchema);
export default Participant;
