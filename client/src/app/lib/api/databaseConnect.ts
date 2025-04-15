import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

export default async function dbConnect(): Promise<void> {
	try {
	if(!MONGO_URI){
		throw new Error("Database is unreachable.")
	}
	if (isConnected ) {
		return;
	}
		const db = await mongoose.connect(MONGO_URI);
		isConnected = !!db.connection.readyState;
	} catch (error) {
		console.log(error);
		throw error;
	}
}