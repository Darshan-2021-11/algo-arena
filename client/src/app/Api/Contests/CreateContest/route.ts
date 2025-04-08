"use server"
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { fail, success } from "@/app/lib/api/response";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { contestmodel as cm } from "@/app/lib/api/models/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function POST(req: NextRequest) {
	try {

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return fail("Server is not working")
		}

		const cookieStore = cookies();
		const cookie = cookieStore.get("token")?.value;
		if (!cookie) {
			return fail("unauthorized access.", 403);
		}

		const { id, name, admin } = jwt.verify(cookie,secret) as {id:string, name:string,admin:boolean};

		const body = await req.json() as cm;

		await dbConnect();

		await Contest.create(body);

		return success("Contest created successfully.",201);

	} catch (error: any) {
		console.log(error)
		return fail(error.message ? error.message : "something went wrong.")
	}
}
