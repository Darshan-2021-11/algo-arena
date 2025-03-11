'use server'
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	name: { 
		type: String,
		 required: true 
	},
	password: { 
		type: String,
	    required: true 
	},
    isverified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: [true, 'verification token is missing'],
        match: [/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/, 'invalid token'],
    },
    tokenExpires: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
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

const User = mongoose.models.User || model("User", userSchema);
export default User;
