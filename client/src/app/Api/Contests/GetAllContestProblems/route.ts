"use server"
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import ContestProblem from "@/app/lib/api/models/Contest/problemModel";
import { contestproblemmodel as cpm } from "@/app/lib/api/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export interface Response {
	success: boolean,
	problems: Array<cpm>,
	length: number,
	page: number,
	maxpage: number,
	lastelement: number
}


export async function GET(request : NextRequest){
	try{
		const cookieStore = cookies();
		const token = cookieStore.get("token")?.value;
		/*
			 if(!token){
			 return fail("Unauthorised access",403);
			 }
			 */

		const params = new URL(request.url).searchParams;
		const page : number = Number(params.get('page')) || 1;
		const pagelen = Number(params.get('len')) || 10;
		let i = 0, j = pagelen;
		if(page > 1){
			i = (pagelen * page) - pagelen;
			j = i + pagelen;
		}

		await dbConnect();

		const result = await ContestProblem.aggregate([
			{
				$match:{}
			},
			{
				$sort: { field: "createdAt", }
			},
			{
				$skip: i
			},
			{
				$limit:
					pagelen
			},
			{
				$project:
					{
					title: 1,
					difficulty: 1,
				}
			},
		])


		return NextResponse.json({
			success: true,
			message: "Successfully fetched data",
			Problems: result,
			end: result?.length < pagelen
		},{status: 200})
	}catch(err){
		console.log(err);
		return NextResponse.json({
			success: false,
			err
		},{status: 500})
	}
}
