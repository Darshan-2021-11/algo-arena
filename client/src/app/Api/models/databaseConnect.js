import mongoose from 'mongoose';
import User from './userModel.js'
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/algo-arena");

const email = "darshan@gmail.com";
let user = await User.findById(email).exec();
if (!user) {
	user = await User.create({
		_id: email,
		totalQuestionSolved: 3,
		totalQuestionAttempted: 5,
		questionSolved: [1, 2, 3],
		duetsAttempted: 6,
		duets: [{
			wins: 3,
		}]
	})
}
