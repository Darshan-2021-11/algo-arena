import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/algo-arena"; // Ensure this e

// export default async function dbConnect() {
//   try {
//     let conn = await mongoose.connect(MONGO_URI);
//     return conn;
//   } catch (e) {
//     throw new Error(e);
//   }
// }

if (!MONGO_URI) {
	throw new Error("Please define the MONGO_URI environment variable in your .env file.");
  }
  
  let cached = global.mongoose;
  
  if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
  }
  
  export default async function dbConnect() {
	if (cached.conn) {
	  return cached.conn;
	}
  
	if (!cached.promise) {
	  cached.promise = mongoose.connect(MONGO_URI, {
	  }).then((mongoose) => mongoose);
	}
  
	cached.conn = await cached.promise;
	return cached.conn;
  }

// const email = "darshan@gmail.com";
// let user = await User.findById(email).exec();
// if (!user) {
// 	user = await User.create({
// 		_id: email,
// 		totalQuestionSolved: 3,
// 		totalQuestionAttempted: 5,
// 		questionSolved: [1, 2, 3],
// 		duetsAttempted: 6,
// 		duets: [{
// 			wins: 3,
// 		}]
// 	})
// }
