"use server"
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { fail, success } from "@/app/lib/api/response";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return fail("Server is not working")
		}

		const cookieStore = cookies();
		const token = cookieStore.get("token")?.value;
		if (!token) {
			return fail("unauthorized access.", 403);
		}

		const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin?: boolean };
		if (!decodedtoken.admin) {
			return fail("Unauthorized accesss.", 403);
		}

		const body = await req.json();
		const { startTime, endTime, name, description, ispublic } = body;
		console.log(startTime, endTime, name, description, ispublic)

		if (!startTime || !endTime || !name || !description || typeof (ispublic) !== "boolean") {
			return fail("All data are required.", 400);
		}

		if (name.length < 3 || name.length > 100) {
			return fail("Name must be between 3 and 100 characters.", 400);
		}

		if (description.length < 10 || description.length > 500) {
			return fail("Description must be between 10 and 500 characters.", 400);
		}

		if (typeof (startTime) !== 'string' || typeof (endTime) !== 'string' || typeof (name) !== "string" || typeof (description) !== "string" || typeof (ispublic) !== "boolean") {
			return fail("Invalid input type");
		}

		await dbConnect();

		await Contest.create({
			name,
			description,
			startTime,
			endTime,
			ispublic,
			problems: []
		});

		return success("Contest created successfully.", 201);

	} catch (error: any) {
		console.log(error)
		return fail(error.message ? error.message : "something went wrong.")
	}
}
