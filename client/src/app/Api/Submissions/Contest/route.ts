'use server'

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import ContestProblem from "../../../lib/api/models/Contest/problemModel.ts";
import { fail } from "@/app/lib/api/response";
import Submission from "@/app/lib/api/models/User/submissionModel";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import dbConnect from "@/app/lib/api/databaseConnect";
import mongoose from "mongoose";
import UserProblem from "@/app/lib/api/models/User/userProblemModel";
import Activity from "@/app/lib/api/models/User/activityModel";

interface Testcase {
	input: string
	output: string
}


export async function POST(req: NextRequest) {
	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return fail("Server is not working")
		}
		const cookieStore = cookies();
		const token = cookieStore.get("token")?.value;
		if (!token) {
			return fail("Unauthorised access", 403);
		}

		const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin: boolean };

		const { id, alias, contestid, code, lang } = await req.json();
		const { testcases } = await ContestProblem.findById(id).select("testcases") as { testcases: Testcase[] };

		if (testcases.length == 0) {
			return fail("No test cases found.");
		}

		const tokens: string[] = [];

		const prom = testcases.map((t) => {
			const judgeurl = 'http://localhost:2358/submissions/';
			const submissionBody = {
				source_code: code,
				language_id: 71,
				stdin: t.input,
				expected_output: t.output,
				cpu_time_limit: 15,
				wall_time_limit: 20
			};

			switch (lang) {
				case "javascript":
					submissionBody.language_id = 63;
				break;
				case "python":
					submissionBody.language_id = 71;
				break;
				case "go":
					submissionBody.language_id = 60;
				break;
				case "cpp":
					submissionBody.language_id = 54;
				break;
				case "c":
					submissionBody.language_id = 50;
				break;
				case "java":
					submissionBody.language_id = 62;
				break;
			}


			return axios.post<{ token: string }>(judgeurl, submissionBody)
			.then(({ data }) => {
				tokens.push(data.token);
			})
			.catch((err: any) => {
				throw new Error(err.message ? err.message : "Unable to reach Judge0.");
			})

		})
		await Promise.all(prom)
		await dbConnect()
		const session = await mongoose.startSession();
		let submission;
		try {
			session.startTransaction();
			submission = await Submission.create({
				user: decodedtoken.id,
				problem: id,
				language: lang,
				code: code,
			})
			const usersubmission = await UserProblem.findOneAndUpdate({ user: decodedtoken.id }, { $inc: { submission: 1 } });
			if (!usersubmission) {
				await UserProblem.create({
					user: decodedtoken.id,
					submission:1
				})
			}
		const submission = {
			time: "$$NOW",
			tokens,
			status: "waiting",
		};

		const updated = await participant.findoneandupdate(
			{
				userid,
				contestid,
				"problems.alias": alias
			},
			{
				$push: {
					"problems.$.submissions": submission
				}
			},
			{ new: true }
		);

		if (!updated) {
			updated = await Participant.findOneAndUpdate(
				{ userId, contestId },
				{
					$push: {
						problems: {
							alias,
							submissions: [submission]
						}
					}
				},
				{ new: true }
			);
		}

		if (!updated) {
			console.warn("Participant not found.");
			return null;
		}

			);
			const targetDate = new Date(); 
			targetDate.setHours(0, 0, 0, 0)

			const activity = await Activity.findOneAndUpdate({ user: decodedtoken.id, "activity.date": targetDate }, { $inc: { "activity.$.submissions": 1 } })
			if(!activity){
				await Activity.updateOne({user:decodedtoken.id},{
					$push:{activity:{date:targetDate, submission:1}}
				},
				{
					upsert:true
				})
			}
			await session.commitTransaction();
		} catch (error:any) {
			console.log(error)
			await session.abortTransaction();
			return fail(error.message ? error.message : "Data could not be saved.")
		}
		return NextResponse.json({ success: true, tokens, message: "successfully sent to run codes.", problemid: submission._id }, { status: 200 });
	} catch (err: any) {
		console.log(err)
		return NextResponse.json({ success: false, err: err.message ? err.message : "something went wrong" }, { status: 500 });
	}
}
