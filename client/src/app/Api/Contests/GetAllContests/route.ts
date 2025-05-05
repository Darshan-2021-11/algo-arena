"use server"
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import contestModel from "@/app/lib/api/models/Contest/contestModel";
import { contestmodel as cm } from "@/app/lib/api/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import jwt from "jsonwebtoken";
import { middleware } from "../../middleware/route";

export interface Response {
	success: boolean,
	problems: Array<cm>,
	length: number,
	page: number,
	maxpage: number,
	lastelement: number
}


export async function GET(req: NextRequest) {
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
			return fail("Unauthorised access", 403);
		}

		const params = new URL(req.url).searchParams;
		const page: number = Number(params.get('P')) || 1;
		const pagelen = Number(params.get('l')) || 10;
		let i = 0, j = pagelen;
		if (page > 1) {
			i = (pagelen * page) - pagelen;
			j = i + pagelen;
		}


		await dbConnect();

		const result = await contestModel.aggregate([
			{
				$match: {}
			},
			{
				$skip: i
			},
			{
				$limit: pagelen
			},
			{
				$project: {
					"name": 1,
					"startTime": 1,
					"endTime": 1,
					"problems": 1
				}
			},
		])

		return NextResponse.json({
			success: true,
			message: "Successfully fetched data",
			Contest: result,
			end: result?.length < pagelen
		}, { status: 200 })
	} catch (err) {
		console.log(err);
		return NextResponse.json({
			success: false,
			err
		}, { status: 500 })
	}
}
