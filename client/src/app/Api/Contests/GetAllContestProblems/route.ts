"use server"
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { contestproblemmodel as cpm } from "@/app/lib/api/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Problem from "@/app/lib/api/models/Problem/problemModel";

export interface Response {
	success: boolean,
	problems: Array<cpm>,
	length: number,
	page: number,
	maxpage: number,
	lastelement: number
}


export async function GET(req: NextRequest) {
	try {
		;
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

		const params = new URL(req.url).searchParams;
		const contestid = params.get("id");
		if (!contestid) {
			return fail("invalid req");
		}

		await dbConnect();

		const result = await Problem.aggregate([
			{
				$match: { contest: new mongoose.Types.ObjectId(contestid) }
			},
			{
				$project: {
					alias: 1,
					score: 1,
				}
			}
		])

		return NextResponse.json({
			success: true,
			message: "Successfully fetched data",
			Problems: result,
		}, { status: 200 })
	} catch (err) {
		console.log(err);
		return NextResponse.json({
			success: false,
			err
		}, { status: 500 })
	}
}
