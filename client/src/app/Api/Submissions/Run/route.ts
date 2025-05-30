'use server'

import axios from "@/app/lib/errorhandler";
import { NextRequest, NextResponse } from "next/server";
import Problem from "../../../lib/api/models/Problem/problemModel";
import { fail } from "@/app/lib/api/response";
import Submission from "@/app/lib/api/models/User/submissionModel";
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
        ;
        const { id, code, lang,user } = await req.json();
        const problem = await Problem.findById(id).select("testcases difficulty") as { testcases: Testcase[], difficulty:string };
        const { testcases, difficulty } = problem 

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
                    console.log(err)
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
                user: user,
                problem: id,
                language: lang,
                code: code,
            })


            const update : any =  {
                $inc: { submission: 1 }
            };

            if(difficulty === "Hard"){
                update.$inc.hardQuestion = 1;
            }else if(difficulty === "Medium"){
                update.$inc.mediumQuestion = 1;
            }else{
                update.$inc.easyQuestion = 1;
            }

            const usersubmission = await UserProblem.findOneAndUpdate({ user: user }, update);
            if (!usersubmission) {
                await UserProblem.create({
                    user: user,
                    submission:1
                })
            }
            const targetDate = new Date(); 
            targetDate.setHours(0, 0, 0, 0)

            const activity = await Activity.findOneAndUpdate({ user: user, "activity.date": targetDate }, { $inc: { "activity.$.submissions": 1 } })
            if(!activity){
                await Activity.updateOne({user:user},{
                    $push:{activity:{date:targetDate, submission:1}}
                },
                {upsert:true}
            )
            }
            await session.commitTransaction();
        } catch (error:any) {
            console.log(error)
            await session.abortTransaction();
            await session.endSession();
            return fail(error.message ? error.message : "Data could not be saved.")
        }finally{
            await session.endSession();
        }




        return NextResponse.json({ success: true, tokens, message: "successfully sent to run codes.", problemid: submission._id }, { status: 200 });


    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ success: false, err: err.message ? err.message : "something went wrong" }, { status: 500 });
    }
}
