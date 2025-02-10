import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	totalQuestionSolved: {
		type: Number,
		default: 0,
	},
	totalQuestionAttempted: {
		type: Number,
		default: 0,
	},
	questionSolved: {
		type: [Number],
		default: [],
	},
	duetsAttempted: {
		type: Number,
		default: 0,
	},
	duetwins: {
		type: Number,
		default: 0,
	},
	duetlost: {
		type: Number,
		default: 0,
	},
	duetdraw: {
		type: Number,
		default: 0,
	},
});

// const User = model("User", userSchema);
// export default  User;
export default mongoose.models.User || mongoose.model('User', UserSchema);
