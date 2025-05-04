"use server"

import { NextRequest } from "next/server";
import { fail, success } from "@/app/lib/api/response";
import dbConnect from "@/app/lib/api/databaseConnect";
import mongoose from "mongoose";
import Contest from "@/app/lib/api/models/Contest/contestModel";
// import ContestProblem from "@/app/lib/api/models/Contest/problemModel";

export async function POST(req: NextRequest) {
    try {
        const { problems, contestid } = await req.json();

        await dbConnect();

        if (!Array.isArray(problems)) {
            return fail("problems is not an array", 400);
        }

        const p = problems.map((pr) => {
            return new mongoose.Types.ObjectId(pr);
        })

        const result = await Contest.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(contestid) }, { $push: { problems: { $each: p } } })

        return success("succesfully added problem", result)

    } catch (error: any) {
        console.log(error)
        return fail(error.message ? error.message : "something went wrong.")
    }
}